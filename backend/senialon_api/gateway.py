"""Transporte auditado. Replay accede a PostgreSQL, nunca al proveedor."""
import asyncio
import hashlib
import json
from decimal import Decimal

import httpx
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from .db import Budget, ProviderCall, Recording, Step, Run
from .providers.http import JsonHttpTransport, ProviderCall as HttpCall


class DomainError(Exception):
    def __init__(self, message, status=409):
        self.message, self.status = message, status
        super().__init__(message)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False,
                                     separators=(',', ':'), allow_nan=False).encode()).hexdigest()


class Gateway:
    def __init__(self, sessions, config, transport=None):
        self.sessions, self.config, self.transport = sessions, config, transport

    def require_key(self, provider, mode):
        if mode == 'replay':
            return ''
        field = {'jev': 'typesafe_api_key', 'youtube': 'youtube_api_key', 'gemini': 'gemini_api_key'}[provider]
        value = getattr(self.config, field).get_secret_value()
        if not value:
            raise DomainError(f'Falta configurar la credencial de {provider}.')
        return value

    def request(self, *, provider, mode, operation, endpoint, payload, validator, method='POST', version='senialon-contract-1'):
        key = self.require_key(provider, mode)
        request = {'provider': provider, 'method': method, 'endpoint': endpoint,
                   'payload': payload, 'version': version}
        fingerprint = digest(request)
        request['operation_id'] = operation.split(':')[0]
        call_id = digest({'operation': operation, 'fingerprint': fingerprint, 'mode': mode})
        with self.sessions() as db:
            step = db.get(Step, operation.split(':')[0])
            source_run_id = step.run_id if step else None
            if mode == 'replay' and step:
                source_run_id = db.get(Run, step.run_id).data['source']['run_id']
            recording_id = digest({'source_run_id': source_run_id, 'fingerprint': fingerprint})
            previous = db.get(ProviderCall, call_id)
            if previous:
                if previous.status == 'done':
                    return validator(previous.response)
                raise DomainError('La solicitud está en curso, falló o tiene resultado incierto. No se repetirá automáticamente.')
            if mode == 'replay':
                record = db.get(Recording, recording_id)
                if not record:
                    raise DomainError(f'No hay un registro web compatible para {provider}. No se realizó ninguna llamada al proveedor.', 404)
                result = validator(record.response)
                db.add(ProviderCall(id=call_id, provider=provider, fingerprint=fingerprint, mode=mode,
                                    status='done', request=request, response=result, reservation_usd=0))
                db.commit()
                return result

        gateway = self
        claimed = False

        class Gate:
            async def claim_and_reserve(self, identity):
                nonlocal claimed
                gateway.claim_and_reserve(call_id=call_id, provider=provider, fingerprint=fingerprint,
                                          mode=mode, request=request)
                claimed = True

        async def send():
            # Las claves Google viajan en cabecera, nunca en una URL registrable.
            headers = (("Authorization", f"Bearer {key}"),) if provider == 'jev' else (("x-goog-api-key", key),)
            call = HttpCall(provider=provider, purpose=operation, operation_id=request['operation_id'],
                            substep_id=operation, input_version=fingerprint, method=method, url=endpoint,
                            headers=headers, params=tuple(payload.items()) if provider == 'youtube' else (),
                            json_body=payload if method == 'POST' else None, request_id_header='x-request-id')
            async with httpx.AsyncClient(transport=self.transport) as client:
                transport = JsonHttpTransport(client, Gate(), timeout_seconds=self.config.provider_timeout_seconds)
                return await transport.send(call)

        try:
            # Las rutas ejecutan el dominio en un worker, no en el event loop de ASGI.
            response = asyncio.run(send())
            raw = response.json_body
            with self.sessions() as db:
                db.get(ProviderCall, call_id).raw_response = raw
                db.commit()
            result = validator(raw)
            with self.sessions() as db:
                call = db.get(ProviderCall, call_id)
                call.response, call.raw_response, call.status = result, raw, 'done'
                if mode == 'record' and not db.get(Recording, recording_id):
                    try:
                        with db.begin_nested():
                            db.add(Recording(id=recording_id, fingerprint=fingerprint, source_run_id=source_run_id, provider=provider, source_call_id=call_id,
                                             request=request, response=result))
                            db.flush()
                    except IntegrityError:
                        pass  # Otra ejecución ya guardó el mismo registro compatible.
                db.commit()
            return result
        except Exception as exc:
            # Nunca persistir str(httpx_error): puede incluir una URL con API key.
            message = exc.message if isinstance(exc, DomainError) else (
                f'{provider}: respuesta inválida o conexión interrumpida; resultado incierto, sin reintento automático.')
            with self.sessions() as db:
                call = db.get(ProviderCall, call_id)
                if call and claimed:
                    call.status, call.error = 'uncertain', message
                    db.commit()
            raise DomainError(message, exc.status if isinstance(exc, DomainError) else 502) from None

    def claim_and_reserve(self, *, call_id, provider, fingerprint, mode, request):
        if self.config.api_mode == 'replay' and mode != 'replay':
            raise DomainError('Replay no permite nuevos envíos de una ejecución live/record.')
        with self.sessions() as db:
            reserve = Decimal('0')
            if provider != 'youtube':
                reserve = getattr(self.config, f'{provider}_reservation_usd')
                c = self.config
                if not c.paid_calls_enabled or reserve is None or not c.pricing_reference or c.available_balance_usd is None:
                    raise DomainError('Llamadas pagadas bloqueadas: verifica tarifa, saldo y reserva máxima por petición en la configuración.')
            # PostgreSQL serializa reservas de todas las ejecuciones con la misma fila.
            budget = db.execute(select(Budget).where(Budget.id == 'demo').with_for_update()).scalar_one()
            limit = min(self.config.budget_usd, self.config.available_balance_usd or self.config.budget_usd)
            if budget.reserved_usd + reserve + self.config.confirmed_external_spend_usd > limit:
                raise DomainError('Presupuesto o saldo insuficiente para reservar esta petición.')
            budget.reserved_usd += reserve
            db.add(ProviderCall(id=call_id, provider=provider, fingerprint=fingerprint, mode=mode,
                                status='running', request=request, reservation_usd=reserve))
            try:
                db.commit()
            except IntegrityError:
                db.rollback()
                raise DomainError('Otro proceso ya reclamó esta petición.') from None
