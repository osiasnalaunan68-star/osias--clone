import sqlite3
from typing import Dict, List, Optional


class SettingsRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def get_all(self) -> List[sqlite3.Row]:
        return self.conn.execute("SELECT * FROM settings ORDER BY key ASC").fetchall()

    def get(self, key: str) -> Optional[str]:
        row = self.conn.execute("SELECT value FROM settings WHERE key = ?", (key,)).fetchone()
        return row["value"] if row is not None else None

    def set(self, key: str, value: str) -> None:
        self.conn.execute(
            """
            INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
            """,
            (key, value),
        )

    def set_many(self, values: Dict[str, str]) -> None:
        for key, value in values.items():
            self.set(key, value)
