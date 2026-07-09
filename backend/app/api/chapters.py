from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from app.db.database import get_connection
from app.models.schemas import NodeOut
from app.services.chapter_service import ChapterNotFoundError, ChapterService

router = APIRouter(prefix="/api", tags=["chapters"])
service = ChapterService()


@router.get("/titles")
def list_titles():
    return service.list_titles_with_chapters()


@router.get("/chapter/{chapter_number}", response_model=NodeOut)
def get_chapter(chapter_number: str, title_number: Optional[str] = Query(None)):
    try:
        return service.get_chapter(chapter_number, title_number)
    except ChapterNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/chapters/all")
def list_all_chapters():
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT c.id, c.node_number, c.title, c.created_at, c.updated_at,
                   COUNT(s.id) as section_count,
                   t.node_number as title_number
            FROM legal_nodes c
            LEFT JOIN legal_nodes s ON s.parent_id = c.id AND s.node_type = 'section'
            LEFT JOIN legal_nodes t ON t.id = c.parent_id AND t.node_type = 'title'
            WHERE c.node_type = 'chapter'
            GROUP BY c.id
            ORDER BY CAST(t.node_number AS INTEGER) NULLS FIRST, CAST(c.node_number AS INTEGER)
        """).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()
