import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


class Settings:
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", str(BASE_DIR / "customs_law.db"))
    BACKUP_DIR: str = os.getenv("BACKUP_DIR", str(BASE_DIR / "backups"))
    DEV_PANEL_ENABLED: bool = os.getenv("DEV_PANEL_ENABLED", "true").lower() == "true"
    DEV_ADMIN_KEY: str = os.getenv("DEV_ADMIN_KEY", "").strip()
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")


settings = Settings()
