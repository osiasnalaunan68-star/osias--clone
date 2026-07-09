import os

from app.core.config import settings as app_settings
from app.db.database import get_connection
from app.models.schemas import DatabaseStatus, SearchIndexStatus
from app.repositories.node_repository import NodeRepository
from app.repositories.search_repository import SearchRepository


class StatusService:
    def database_status(self) -> DatabaseStatus:
        conn = get_connection()
        try:
            repo = NodeRepository(conn)
            last_import = conn.execute(
                "SELECT started_at FROM import_logs WHERE status = 'success' ORDER BY started_at DESC LIMIT 1"
            ).fetchone()
            size = os.path.getsize(app_settings.DATABASE_PATH) if os.path.exists(app_settings.DATABASE_PATH) else 0
            return DatabaseStatus(
                total_nodes=repo.total_nodes(),
                counts_by_type=repo.counts_by_type(),
                database_size_bytes=size,
                last_import_at=last_import["started_at"] if last_import is not None else None,
            )
        finally:
            conn.close()

    def search_index_status(self) -> SearchIndexStatus:
        conn = get_connection()
        try:
            search_repo = SearchRepository(conn)
            return SearchIndexStatus(indexed_entries=search_repo.count(), last_rebuild_at=None)
        finally:
            conn.close()
