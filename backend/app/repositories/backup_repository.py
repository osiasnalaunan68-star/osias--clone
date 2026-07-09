import sqlite3
import uuid as uuid_lib
from typing import List, Optional


class BackupRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def record(
        self, backup_type: str, file_path: str, reason: str, chapter_number: Optional[str] = None
    ) -> int:
        backup_uuid = str(uuid_lib.uuid4())
        cursor = self.conn.execute(
            """
            INSERT INTO backups (uuid, backup_type, file_path, reason, chapter_number)
            VALUES (?, ?, ?, ?, ?)
            """,
            (backup_uuid, backup_type, file_path, reason, chapter_number),
        )
        return cursor.lastrowid

    def list_recent(self, limit: int = 50) -> List[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM backups ORDER BY created_at DESC LIMIT ?", (limit,)
        ).fetchall()
