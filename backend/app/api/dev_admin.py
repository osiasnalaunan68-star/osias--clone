from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.core.config import settings as app_settings
from app.db.database import get_connection
from app.models.schemas import (
    DatabaseStatus,
    ImportLogOut,
    SearchIndexStatus,
    SettingOut,
    SettingsUpdate,
)
from app.repositories.backup_repository import BackupRepository
from app.repositories.import_log_repository import ImportLogRepository
from app.repositories.node_repository import NodeRepository
from app.repositories.search_repository import SearchRepository
from app.services.chapter_service import ChapterNotFoundError
from app.services.export_service import ExportService
from app.services.pipeline.backup_manager import BackupManager
from app.services.pipeline.search_indexer import SearchIndexer
from app.services.settings_service import SettingsService
from app.services.status_service import StatusService

router = APIRouter(prefix="/api/dev", tags=["development-admin"])
export_service = ExportService()
settings_service = SettingsService()
status_service = StatusService()


def _check_enabled():
    if not app_settings.DEV_PANEL_ENABLED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


@router.get("/history", response_model=List[ImportLogOut])
def get_history(limit: int = 50):
    _check_enabled()
    conn = get_connection()
    try:
        repo = ImportLogRepository(conn)
        return [ImportLogOut(**dict(row)) for row in repo.list_recent(limit)]
    finally:
        conn.close()


@router.get("/status/database", response_model=DatabaseStatus)
def get_database_status():
    _check_enabled()
    return status_service.database_status()


@router.get("/status/search-index", response_model=SearchIndexStatus)
def get_search_index_status():
    _check_enabled()
    return status_service.search_index_status()


@router.post("/search-index/rebuild")
def rebuild_search_index():
    _check_enabled()
    conn = get_connection()
    try:
        indexer = SearchIndexer(NodeRepository(conn), SearchRepository(conn))
        count = indexer.reindex_all()
        conn.commit()
        return {"success": True, "indexed_entries": count}
    finally:
        conn.close()


@router.get("/search")
def dev_search(q: str, limit: int = 20):
    _check_enabled()
    conn = get_connection()
    try:
        rows = SearchRepository(conn).search(q, limit)
        return [dict(row) for row in rows]
    finally:
        conn.close()


@router.post("/backup")
def create_backup():
    _check_enabled()
    conn = get_connection()
    try:
        manager = BackupManager(BackupRepository(conn))
        path = manager.backup_sqlite_file(reason="manual backup")
        conn.commit()
        return {"success": True, "file_path": path}
    finally:
        conn.close()


@router.get("/export-chapter/{chapter_number}")
def export_chapter(chapter_number: str, title_number: Optional[str] = Query(None)):
    _check_enabled()
    try:
        return export_service.export_chapter(chapter_number, title_number)
    except ChapterNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/export-title/{title_number}")
def export_title(title_number: str):
    _check_enabled()
    try:
        return export_service.export_title(title_number)
    except ChapterNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/chapter/{chapter_number}")
def delete_chapter(chapter_number: str, title_number: Optional[str] = Query(None)):
    _check_enabled()
    conn = get_connection()
    try:
        node_repo = NodeRepository(conn)
        if title_number:
            title_row = node_repo.type_number_exists("title", title_number)
            if not title_row:
                raise HTTPException(status_code=404, detail=f"Title {title_number} not found")
            chapter = node_repo.chapter_exists_under_title(title_row["id"], chapter_number)
        else:
            chapter = node_repo.chapter_exists_under_title(None, chapter_number)
        if chapter is None:
            raise HTTPException(status_code=404, detail="Chapter not found")

        manager = BackupManager(BackupRepository(conn))
        chapter_data = export_service.export_chapter(chapter_number, title_number)
        manager.backup_chapter_json(chapter_number, chapter_data, reason="pre-delete backup")

        search_repo = SearchRepository(conn)
        for node_id in node_repo.get_subtree_ids(chapter["id"]):
            search_repo.delete_for_nodes([node_id])
        node_repo.delete_node(chapter["id"])
        conn.commit()
        return {"success": True, "message": f"Chapter {title_number + '-' if title_number else ''}{chapter_number} deleted"}
    finally:
        conn.close()


@router.get("/settings", response_model=List[SettingOut])
def get_settings():
    _check_enabled()
    return settings_service.get_all()


@router.put("/settings", response_model=List[SettingOut])
def update_settings(payload: SettingsUpdate):
    _check_enabled()
    return settings_service.update(payload.values)
