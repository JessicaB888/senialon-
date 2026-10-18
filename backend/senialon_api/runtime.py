"""Configuración operativa; la credencial HTTP continúa en settings.Settings.

No lee archivos .env implícitamente ni habilita consumos por tener una clave.
"""

from decimal import Decimal
from typing import Literal

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class RuntimeSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=None, extra="ignore", env_ignore_empty=True, allow_inf_nan=False)

    database_url: SecretStr = SecretStr("")
    typesafe_api_key: SecretStr = SecretStr("")
    youtube_api_key: SecretStr = SecretStr("")
    gemini_api_key: SecretStr = SecretStr("")
    jev_model: str = Field(default="jev-latest", min_length=1)
    gemini_model: str = Field(default="", pattern=r"^[A-Za-z0-9._-]*$")
    api_mode: Literal["live", "record", "replay"] = "record"
    paid_calls_enabled: bool = False
    budget_usd: Decimal = Field(default=Decimal("20"), gt=0, le=20)
    jev_reservation_usd: Decimal | None = Field(default=None, gt=0)
    gemini_reservation_usd: Decimal | None = Field(default=None, gt=0)
    pricing_reference: str = ""
    available_balance_usd: Decimal | None = Field(default=None, gt=0)
    confirmed_external_spend_usd: Decimal = Field(default=Decimal("0"), ge=0)
    # Adquisición hace como máximo dos requests por unidad. Dejar margen al BFF (50 s).
    provider_timeout_seconds: float = Field(default=15, gt=0, le=15)
