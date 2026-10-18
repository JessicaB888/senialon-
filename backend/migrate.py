"""Migración inicial aditiva. Nunca borra tablas ni reinicia reservas existentes."""

import argparse

from sqlalchemy.exc import IntegrityError

from senialon_api.db import Base, Budget, make_sessions
from senialon_api.runtime import RuntimeSettings


def migrate(config: RuntimeSettings):
    engine, sessions = make_sessions(config.database_url.get_secret_value())
    try:
        Base.metadata.create_all(engine)
        with sessions() as db:
            if db.get(Budget, "demo") is None:
                db.add(Budget(id="demo", reserved_usd=0))
                try:
                    db.commit()
                except IntegrityError:
                    db.rollback()
                    if db.get(Budget, "demo") is None:
                        raise
    finally:
        engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", help="Archivo privado explícito, nunca versionado.")
    args = parser.parse_args()
    try:
        migrate(RuntimeSettings(_env_file=args.env_file))
    except Exception:
        # Los errores del driver pueden contener el DSN; no imprimirlos.
        raise SystemExit("No se pudo preparar PostgreSQL. Revisa la configuración y conectividad.") from None
    print("Esquema SENIALON preparado; resultados y reservas previos conservados.")
