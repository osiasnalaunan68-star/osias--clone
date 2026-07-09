from typing import Dict, List

from app.db.database import get_connection
from app.models.schemas import SettingOut
from app.repositories.settings_repository import SettingsRepository


class SettingsService:
    def get_all(self) -> List[SettingOut]:
        conn = get_connection()
        try:
            repo = SettingsRepository(conn)
            rows = repo.get_all()
            return [SettingOut(key=r["key"], value=r["value"], updated_at=r["updated_at"]) for r in rows]
        finally:
            conn.close()

    def update(self, values: Dict[str, str]) -> List[SettingOut]:
        conn = get_connection()
        try:
            repo = SettingsRepository(conn)
            repo.set_many({k: str(v) for k, v in values.items()})
            conn.commit()
            return self.get_all()
        finally:
            conn.close()
