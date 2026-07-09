import json
import shutil
from datetime import datetime
from pathlib import Path

from app.core.config import settings
from app.repositories.backup_repository import BackupRepository


class BackupManager:
    def __init__(self, backup_repo: BackupRepository):
        self.backup_repo = backup_repo
        Path(settings.BACKUP_DIR).mkdir(parents=True, exist_ok=True)

    def backup_sqlite_file(self, reason: str) -> str:
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        dest = Path(settings.BACKUP_DIR) / f"customs_law_{timestamp}.db"
        shutil.copy2(settings.DATABASE_PATH, dest)
        self.backup_repo.record("sqlite", str(dest), reason)
        return str(dest)

    def backup_chapter_json(self, chapter_number: str, chapter_data: dict, reason: str) -> str:
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        dest = Path(settings.BACKUP_DIR) / f"chapter_{chapter_number}_{timestamp}.json"
        with open(dest, "w", encoding="utf-8") as f:
            json.dump(chapter_data, f, indent=2, ensure_ascii=False)
        self.backup_repo.record("json", str(dest), reason, chapter_number)
        return str(dest)
