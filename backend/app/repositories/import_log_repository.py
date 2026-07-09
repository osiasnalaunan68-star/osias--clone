import sqlite3
import uuid as uuid_lib
from typing import List, Optional


class ImportLogRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def create(
        self,
        started_at: str,
        import_mode: str,
        chapter_number: Optional[str],
        title_number: Optional[str],
        created_by: Optional[str],
        file_name: Optional[str],
    ) -> int:
        log_uuid = str(uuid_lib.uuid4())
        cursor = self.conn.execute(
            """
            INSERT INTO import_logs
                (uuid, started_at, import_mode, chapter_number, title_number,
                 status, created_by, file_name)
            VALUES (?, ?, ?, ?, ?, 'failed', ?, ?)
            """,
            (log_uuid, started_at, import_mode, chapter_number, title_number, created_by, file_name),
        )
        return cursor.lastrowid

    def complete(
        self,
        log_id: int,
        finished_at: str,
        duration_ms: int,
        sections_imported: int,
        nodes_created: int,
        nodes_updated: int,
        status: str,
        error_message: Optional[str],
        search_index_time_ms: Optional[int],
    ) -> None:
        self.conn.execute(
            """
            UPDATE import_logs
            SET finished_at = ?, duration_ms = ?, sections_imported = ?,
                nodes_created = ?, nodes_updated = ?, status = ?,
                error_message = ?, search_index_time_ms = ?
            WHERE id = ?
            """,
            (
                finished_at, duration_ms, sections_imported, nodes_created,
                nodes_updated, status, error_message, search_index_time_ms, log_id,
            ),
        )

    def list_recent(self, limit: int = 50) -> List[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM import_logs ORDER BY started_at DESC LIMIT ?", (limit,)
        ).fetchall()
