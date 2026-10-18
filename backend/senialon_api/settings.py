"""Configuración de servidor, sin valores de acceso por defecto ni logging."""

import os
from dataclasses import dataclass, field
from urllib.parse import urlsplit


@dataclass(frozen=True)
class Settings:
    username: str = field(default="", repr=False)
    password: str = field(default="", repr=False)
    allowed_origin: str = ""
    deployed: bool = False

    @classmethod
    def from_environment(cls) -> "Settings":
        return cls(
            username=os.environ.get("DEMO_USERNAME", ""),
            password=os.environ.get("DEMO_PASSWORD", ""),
            allowed_origin=os.environ.get("DEMO_ALLOWED_ORIGIN", ""),
            deployed=os.environ.get("VERCEL") == "1" and os.environ.get("VERCEL_ENV") != "development",
        )

    @property
    def ready(self) -> bool:
        if not self.username.strip() or not self.password.strip() or ":" in self.username:
            return False
        if any(ord(c) < 32 or ord(c) == 127 for c in self.username + self.password):
            return False
        try:
            origin = urlsplit(self.allowed_origin)
            valid_port = origin.port is None or 1 <= origin.port <= 65535
        except ValueError:
            return False
        local_http = (
            not self.deployed
            and origin.scheme == "http"
            and origin.hostname in {"localhost", "127.0.0.1", "::1"}
        )
        return bool(
            (origin.scheme == "https" or local_http)
            and origin.hostname
            and valid_port
            and not origin.username
            and not origin.password
            and not origin.path
            and not origin.query
            and not origin.fragment
        )
