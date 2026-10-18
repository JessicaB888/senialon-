from datetime import datetime, timezone
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import JSON, DateTime, Numeric, String, create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


def now():
    return datetime.now(timezone.utc)


def uid():
    return str(uuid4())


class Base(DeclarativeBase):
    pass


class Run(Base):
    __tablename__ = 'senialon_v1_runs'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uid)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)
    mode: Mapped[str] = mapped_column(String(10))
    data: Mapped[dict] = mapped_column(JSON)


class Step(Base):
    __tablename__ = 'senialon_v1_steps'
    # Identidad determinista por ejecución, etapa y entrada/versiones.
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    run_id: Mapped[str] = mapped_column(ForeignKey('senialon_v1_runs.id'), index=True)
    stage: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(20), default='running')
    result: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error: Mapped[str | None] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class Budget(Base):
    __tablename__ = 'senialon_v1_budget'
    id: Mapped[str] = mapped_column(String(30), primary_key=True)
    reserved_usd: Mapped[Decimal] = mapped_column(Numeric(12, 6), default=0)


class ProviderCall(Base):
    __tablename__ = 'senialon_v1_provider_calls'
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    provider: Mapped[str] = mapped_column(String(20))
    fingerprint: Mapped[str] = mapped_column(String(64), index=True)
    mode: Mapped[str] = mapped_column(String(10))
    status: Mapped[str] = mapped_column(String(20))
    request: Mapped[dict] = mapped_column(JSON)
    response: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    raw_response: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error: Mapped[str | None] = mapped_column(String(300), nullable=True)
    reservation_usd: Mapped[Decimal] = mapped_column(Numeric(12, 6), default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


class Recording(Base):
    __tablename__ = 'senialon_v1_recordings'
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64), index=True)
    source_run_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    provider: Mapped[str] = mapped_column(String(20))
    source_call_id: Mapped[str] = mapped_column(ForeignKey('senialon_v1_provider_calls.id'))
    request: Mapped[dict] = mapped_column(JSON)
    response: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now)


def make_sessions(url: str, *, test=False):
    from sqlalchemy.engine import make_url
    if not test and not url.startswith(('postgresql://', 'postgresql+psycopg://')):
        raise ValueError('Configura DATABASE_URL con PostgreSQL; no se usan archivos locales.')
    if url.startswith('postgresql://'):
        url = url.replace('postgresql://', 'postgresql+psycopg://', 1)
    kwargs = {'pool_pre_ping': True}
    if not test:
        # La instalación local de Windows puede no tener certificados TLS.
        # El despliegue remoto conserva TLS obligatorio.
        local = make_url(url).host in ('127.0.0.1', 'localhost', '::1')
        kwargs.update(pool_size=2, max_overflow=0, pool_timeout=5, connect_args={
            'prepare_threshold': None, 'sslmode': 'prefer' if local else 'require',
            'connect_timeout': 5})
    engine = create_engine(url, **kwargs)
    return engine, sessionmaker(engine, expire_on_commit=False)


class Delivery(Base):
    __tablename__ = 'senialon_v1_deliveries'
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    fingerprint: Mapped[str] = mapped_column(String(64))
    response: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    status_code: Mapped[int | None] = mapped_column(nullable=True)


class Operation(Base):
    __tablename__ = 'senialon_v1_operations'
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    run_id: Mapped[str] = mapped_column(ForeignKey('senialon_v1_runs.id'), index=True)
    data: Mapped[dict] = mapped_column(JSON)
