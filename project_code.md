## File: backend/app/core/__init__.py
```
```

## File: backend/app/core/config.py
```
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
    EDIT_ACCESS_KEY: str = os.getenv("EDIT_ACCESS_KEY", "").strip()
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")


settings = Settings()
```

## File: backend/app/core/security.py
```
from typing import Optional

from fastapi import Header, HTTPException, status

from app.core.config import settings as app_settings


def require_edit_access(
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
) -> None:
    """Optional gate for endpoints that mutate legal text.

    Only enforced when EDIT_ACCESS_KEY is configured; left open otherwise so
    the solo/local workflow keeps working with zero setup.
    """
    if app_settings.EDIT_ACCESS_KEY:
        if not x_admin_key or x_admin_key != app_settings.EDIT_ACCESS_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid X-Admin-Key header",
            )
```

## File: backend/app/db/__init__.py
```
```

## File: backend/app/db/schema.py
```
SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS legal_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    parent_id INTEGER,
    node_type TEXT NOT NULL CHECK(node_type IN ('title','chapter','section','paragraph','subparagraph','item')),
    node_number TEXT,
    title TEXT,
    content TEXT,
    path TEXT NOT NULL,
    depth INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft','published','archived')),
    version INTEGER NOT NULL DEFAULT 1,
    source TEXT,
    effective_date TEXT,
    created_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES legal_nodes(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_nodes_uuid ON legal_nodes(uuid);
CREATE INDEX IF NOT EXISTS idx_nodes_parent ON legal_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_type ON legal_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_nodes_number ON legal_nodes(node_number);
CREATE INDEX IF NOT EXISTS idx_nodes_path ON legal_nodes(path);

-- New unique indexes (replace old idx_unique_type_number)
DROP INDEX IF EXISTS idx_unique_type_number;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_title ON legal_nodes(node_number) WHERE node_type = 'title';
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_section ON legal_nodes(node_number) WHERE node_type = 'section';
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_chapter ON legal_nodes(parent_id, node_number) WHERE node_type = 'chapter';

CREATE TABLE IF NOT EXISTS node_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    FOREIGN KEY (node_id) REFERENCES legal_nodes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_keywords_node ON node_keywords(node_id);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON node_keywords(keyword);

CREATE TABLE IF NOT EXISTS node_cross_references (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    reference_text TEXT NOT NULL,
    referenced_node_id INTEGER,
    url TEXT,
    display_text TEXT,
    note TEXT,
    FOREIGN KEY (node_id) REFERENCES legal_nodes(id) ON DELETE CASCADE,
    FOREIGN KEY (referenced_node_id) REFERENCES legal_nodes(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_xref_node ON node_cross_references(node_id);

CREATE TABLE IF NOT EXISTS node_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    created_by TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (node_id) REFERENCES legal_nodes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notes_node ON node_notes(node_id);

CREATE TABLE IF NOT EXISTS node_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    version INTEGER NOT NULL,
    snapshot_json TEXT NOT NULL,
    change_type TEXT NOT NULL CHECK(change_type IN ('create','update','replace','merge','delete')),
    changed_by TEXT,
    changed_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (node_id) REFERENCES legal_nodes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_history_node ON node_history(node_id);

CREATE TABLE IF NOT EXISTS import_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    duration_ms INTEGER,
    import_mode TEXT NOT NULL CHECK(import_mode IN ('create','replace','merge')),
    chapter_number TEXT,
    title_number TEXT,
    sections_imported INTEGER DEFAULT 0,
    nodes_created INTEGER DEFAULT 0,
    nodes_updated INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK(status IN ('success','failed','partial')),
    error_message TEXT,
    search_index_time_ms INTEGER,
    created_by TEXT,
    file_name TEXT
);
CREATE INDEX IF NOT EXISTS idx_import_logs_status ON import_logs(status);
CREATE INDEX IF NOT EXISTS idx_import_logs_started ON import_logs(started_at);

CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    backup_type TEXT NOT NULL CHECK(backup_type IN ('sqlite','json')),
    file_path TEXT NOT NULL,
    reason TEXT,
    chapter_number TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
    node_id UNINDEXED,
    node_type UNINDEXED,
    node_number,
    title,
    content,
    keywords
);

CREATE TABLE IF NOT EXISTS highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id INTEGER NOT NULL,
    start_offset INTEGER NOT NULL,
    end_offset INTEGER NOT NULL,
    color TEXT NOT NULL DEFAULT '#90EE90',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (node_id) REFERENCES legal_nodes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_highlights_node ON highlights(node_id);
"""

DEFAULT_SETTINGS = {
    "dev_panel_enabled": "true",
    "debug_mode": "false",
    "auto_backup": "true",
    "auto_search_index": "true",
    "preview_required": "false",
    "overwrite_mode": "create",
}
```

## File: backend/app/db/database.py
```
import sqlite3
from contextlib import contextmanager

from app.core.config import settings
from app.db.schema import SCHEMA_SQL, DEFAULT_SETTINGS


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DATABASE_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 5000")
    return conn


@contextmanager
def db_transaction():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def _column_exists(conn: sqlite3.Connection, table: str, column: str) -> bool:
    rows = conn.execute(f"PRAGMA table_info({table})").fetchall()
    return any(row["name"] == column for row in rows)


def _migrate(conn: sqlite3.Connection) -> None:
    """Patch older databases created before url/display_text existed on
    node_cross_references. CREATE TABLE IF NOT EXISTS never adds columns to
    a table that already exists, so this runs on every startup and is a
    no-op once the columns are present."""
    if not _column_exists(conn, "node_cross_references", "url"):
        conn.execute("ALTER TABLE node_cross_references ADD COLUMN url TEXT")
    if not _column_exists(conn, "node_cross_references", "display_text"):
        conn.execute("ALTER TABLE node_cross_references ADD COLUMN display_text TEXT")


def init_db() -> None:
    conn = get_connection()
    try:
        conn.executescript(SCHEMA_SQL)
        _migrate(conn)
        for key, value in DEFAULT_SETTINGS.items():
            conn.execute(
                "INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)",
                (key, value),
            )
        conn.commit()
    finally:
        conn.close()
```

## File: backend/app/models/__init__.py
```
```

## File: backend/app/models/schemas.py
```
from typing import List, Optional
from pydantic import BaseModel


class CrossReferenceOut(BaseModel):
    text: str
    url: Optional[str] = None


class NodeOut(BaseModel):
    id: int
    uuid: str
    node_type: str
    node_number: Optional[str]
    title: Optional[str]
    content: Optional[str]
    status: str
    version: int
    keywords: List[str] = []
    cross_references: List[CrossReferenceOut] = []
    notes: List[str] = []
    children: List["NodeOut"] = []


NodeOut.model_rebuild()


class ChapterListItem(BaseModel):
    id: int
    node_number: Optional[str]
    title: Optional[str]
    section_count: int
    created_at: str
    updated_at: str
```

## File: backend/app/repositories/__init__.py
```
```

## File: backend/app/repositories/node_repository.py
```
import sqlite3
import uuid as uuid_lib
from typing import List, Optional


class NodeRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def type_number_exists(self, node_type: str, node_number: str) -> Optional[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM legal_nodes WHERE node_type = ? AND node_number = ?",
            (node_type, node_number),
        ).fetchone()

    def get_by_id(self, node_id: int) -> Optional[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM legal_nodes WHERE id = ?", (node_id,)
        ).fetchone()

    def get_children(self, parent_id: Optional[int]) -> List[sqlite3.Row]:
        if parent_id is None:
            return self.conn.execute(
                "SELECT * FROM legal_nodes WHERE parent_id IS NULL ORDER BY sort_order ASC"
            ).fetchall()
        return self.conn.execute(
            "SELECT * FROM legal_nodes WHERE parent_id = ? ORDER BY sort_order ASC",
            (parent_id,),
        ).fetchall()

    def get_subtree_ids(self, root_id: int) -> List[int]:
        rows = self.conn.execute(
            """
            WITH RECURSIVE subtree(id) AS (
                SELECT id FROM legal_nodes WHERE id = ?
                UNION ALL
                SELECT legal_nodes.id FROM legal_nodes
                JOIN subtree ON legal_nodes.parent_id = subtree.id
            )
            SELECT id FROM subtree
            """,
            (root_id,),
        ).fetchall()
        return [row["id"] for row in rows]

    def insert_node(
        self,
        parent_id: Optional[int],
        node_type: str,
        node_number: Optional[str],
        title: Optional[str],
        content: Optional[str],
        depth: int,
        sort_order: int,
        status: str = "published",
        version: int = 1,
        source: Optional[str] = None,
        effective_date: Optional[str] = None,
        created_by: Optional[str] = None,
    ) -> int:
        node_uuid = str(uuid_lib.uuid4())
        cursor = self.conn.execute(
            """
            INSERT INTO legal_nodes
                (uuid, parent_id, node_type, node_number, title, content,
                 path, depth, sort_order, status, version, source,
                 effective_date, created_by)
            VALUES (?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                node_uuid, parent_id, node_type, node_number, title, content,
                depth, sort_order, status, version, source,
                effective_date, created_by,
            ),
        )
        new_id = cursor.lastrowid
        if parent_id is None:
            path = str(new_id)
        else:
            parent = self.get_by_id(parent_id)
            path = f"{parent['path']}.{new_id}"
        self.conn.execute("UPDATE legal_nodes SET path = ? WHERE id = ?", (path, new_id))
        return new_id

    def delete_node(self, node_id: int) -> None:
        self.conn.execute("DELETE FROM legal_nodes WHERE id = ?", (node_id,))

    def add_keyword(self, node_id: int, keyword: str) -> None:
        self.conn.execute(
            "INSERT INTO node_keywords (node_id, keyword) VALUES (?, ?)", (node_id, keyword)
        )

    def add_cross_reference(self, node_id: int, reference_text: str, url: str = None, display_text: str = None) -> None:
        self.conn.execute(
            "INSERT INTO node_cross_references (node_id, reference_text, url, display_text) VALUES (?, ?, ?, ?)",
            (node_id, reference_text, url, display_text),
        )

    def add_note(self, node_id: int, note_text: str, created_by: Optional[str]) -> None:
        self.conn.execute(
            "INSERT INTO node_notes (node_id, note_text, created_by) VALUES (?, ?, ?)",
            (node_id, note_text, created_by),
        )

    def get_keywords(self, node_id: int) -> List[str]:
        rows = self.conn.execute(
            "SELECT keyword FROM node_keywords WHERE node_id = ?", (node_id,)
        ).fetchall()
        return [row["keyword"] for row in rows]

    def get_cross_references(self, node_id: int) -> List[dict]:
        rows = self.conn.execute(
            "SELECT reference_text, url, display_text FROM node_cross_references WHERE node_id = ?",
            (node_id,),
        ).fetchall()
        result = []
        for row in rows:
            text = row["display_text"] or row["reference_text"]
            url = row["url"]
            result.append({"text": text, "url": url})
        return result

    def get_notes(self, node_id: int) -> List[str]:
        rows = self.conn.execute(
            "SELECT note_text FROM node_notes WHERE node_id = ?", (node_id,)
        ).fetchall()
        return [row["note_text"] for row in rows]

    def record_history(
        self, node_id: int, version: int, snapshot_json: str, change_type: str, changed_by: Optional[str]
    ) -> None:
        self.conn.execute(
            """
            INSERT INTO node_history (node_id, version, snapshot_json, change_type, changed_by)
            VALUES (?, ?, ?, ?, ?)
            """,
            (node_id, version, snapshot_json, change_type, changed_by),
        )

    def counts_by_type(self) -> dict:
        rows = self.conn.execute(
            "SELECT node_type, COUNT(*) as c FROM legal_nodes GROUP BY node_type"
        ).fetchall()
        return {row["node_type"]: row["c"] for row in rows}

    def total_nodes(self) -> int:
        row = self.conn.execute("SELECT COUNT(*) as c FROM legal_nodes").fetchone()
        return row["c"]

    def chapter_exists_under_title(self, title_id: Optional[int], chapter_number: str) -> Optional[sqlite3.Row]:
        if title_id is None:
            return self.conn.execute(
                "SELECT * FROM legal_nodes WHERE node_type='chapter' AND node_number=? AND parent_id IS NULL",
                (chapter_number,)
            ).fetchone()
        return self.conn.execute(
            "SELECT * FROM legal_nodes WHERE node_type='chapter' AND node_number=? AND parent_id=?",
            (chapter_number, title_id)
        ).fetchone()

    def clear_cross_references(self, node_id: int) -> None:
        self.conn.execute("DELETE FROM node_cross_references WHERE node_id = ?", (node_id,))
```

## File: backend/app/repositories/highlight_repository.py
```
import sqlite3
from typing import List


class HighlightRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def add_highlight(self, node_id: int, start: int, end: int, color: str = "#90EE90") -> int:
        cursor = self.conn.execute(
            "INSERT INTO highlights (node_id, start_offset, end_offset, color) VALUES (?, ?, ?, ?)",
            (node_id, start, end, color),
        )
        return cursor.lastrowid

    def get_highlights_for_node(self, node_id: int) -> List[sqlite3.Row]:
        return self.conn.execute(
            "SELECT * FROM highlights WHERE node_id = ? ORDER BY start_offset",
            (node_id,),
        ).fetchall()

    def get_highlights_for_chapter(self, chapter_id: int) -> List[sqlite3.Row]:
        # Get all descendant node IDs, then fetch highlights
        ids = self.conn.execute(
            """
            WITH RECURSIVE subtree(id) AS (
                SELECT id FROM legal_nodes WHERE id = ?
                UNION ALL
                SELECT legal_nodes.id FROM legal_nodes
                JOIN subtree ON legal_nodes.parent_id = subtree.id
            )
            SELECT id FROM subtree
            """,
            (chapter_id,),
        ).fetchall()
        if not ids:
            return []
        node_ids = [row["id"] for row in ids]
        placeholders = ",".join("?" for _ in node_ids)
        return self.conn.execute(
            f"SELECT * FROM highlights WHERE node_id IN ({placeholders}) ORDER BY node_id, start_offset",
            node_ids,
        ).fetchall()

    def delete_highlight(self, highlight_id: int) -> None:
        self.conn.execute("DELETE FROM highlights WHERE id = ?", (highlight_id,))

    def update_highlight(self, highlight_id: int, start: int, end: int) -> None:
        self.conn.execute(
            "UPDATE highlights SET start_offset = ?, end_offset = ? WHERE id = ?",
            (start, end, highlight_id),
        )
```

## File: backend/app/services/__init__.py
```
```

## File: backend/app/services/chapter_service.py
```
from typing import List, Optional
from app.db.database import get_connection
from app.models.schemas import ChapterListItem, NodeOut, CrossReferenceOut
from app.repositories.node_repository import NodeRepository


class ChapterNotFoundError(Exception):
    pass

def roman_to_int(s: str) -> int:
    # ... (unchanged)
    s = s.upper().strip()
    values = {'I':1, 'V':5, 'X':10, 'L':50, 'C':100}
    total = 0
    prev = 0
    for ch in reversed(s):
        cur = values.get(ch, 0)
        if cur < prev:
            total -= cur
        else:
            total += cur
        prev = cur
    return total if total > 0 else 0


class ChapterService:
    def list_titles_with_chapters(self) -> List[dict]:
        # ... (unchanged from previous version)
        conn = get_connection()
        try:
            titles = conn.execute(
                "SELECT * FROM legal_nodes WHERE node_type = 'title'"
            ).fetchall()
            result = []
            for title in titles:
                chapters = conn.execute(
                    """
                    SELECT c.id, c.node_number, c.title, c.created_at, c.updated_at,
                           COUNT(s.id) as section_count
                    FROM legal_nodes c
                    LEFT JOIN legal_nodes s ON s.parent_id = c.id AND s.node_type = 'section'
                    WHERE c.parent_id = ? AND c.node_type = 'chapter'
                    GROUP BY c.id
                    ORDER BY CAST(c.node_number AS INTEGER) ASC
                    """,
                    (title["id"],),
                ).fetchall()
                if chapters:
                    result.append({
                        "title_id": title["id"],
                        "title_number": title["node_number"],
                        "title_title": title["title"],
                        "chapters": [
                            ChapterListItem(
                                id=ch["id"],
                                node_number=ch["node_number"],
                                title=ch["title"],
                                section_count=ch["section_count"],
                                created_at=ch["created_at"],
                                updated_at=ch["updated_at"],
                            )
                            for ch in chapters
                        ],
                    })
            result.sort(key=lambda t: roman_to_int(t["title_number"]))
            root_chapters = conn.execute(
                """
                SELECT c.id, c.node_number, c.title, c.created_at, c.updated_at,
                       COUNT(s.id) as section_count
                FROM legal_nodes c
                LEFT JOIN legal_nodes s ON s.parent_id = c.id AND s.node_type = 'section'
                WHERE c.node_type = 'chapter' AND c.parent_id IS NULL
                GROUP BY c.id
                ORDER BY CAST(c.node_number AS INTEGER) ASC
                """
            ).fetchall()
            if root_chapters:
                result.append({
                    "title_id": None,
                    "title_number": None,
                    "title_title": "Chapters (no title)",
                    "chapters": [
                        ChapterListItem(
                            id=ch["id"],
                            node_number=ch["node_number"],
                            title=ch["title"],
                            section_count=ch["section_count"],
                            created_at=ch["created_at"],
                            updated_at=ch["updated_at"],
                        )
                        for ch in root_chapters
                    ],
                })
            return result
        finally:
            conn.close()

    def get_chapter(self, chapter_number: str, title_number: Optional[str] = None) -> NodeOut:
        conn = get_connection()
        try:
            repo = NodeRepository(conn)
            if title_number:
                title_row = repo.type_number_exists("title", title_number)
                if not title_row:
                    raise ChapterNotFoundError(f"Title {title_number} not found")
                chapter = repo.chapter_exists_under_title(title_row["id"], chapter_number)
            else:
                chapter = repo.chapter_exists_under_title(None, chapter_number)
            if chapter is None:
                raise ChapterNotFoundError(f"Chapter {chapter_number} not found")
            return self._build_node_out(repo, chapter)
        finally:
            conn.close()

    def _build_node_out(self, repo: NodeRepository, row) -> NodeOut:
        children = [self._build_node_out(repo, c) for c in repo.get_children(row["id"])]
        xrefs = repo.get_cross_references(row["id"])
        cross_refs_out = [CrossReferenceOut(text=x["text"], url=x["url"]) for x in xrefs]
        return NodeOut(
            id=row["id"], uuid=row["uuid"], node_type=row["node_type"],
            node_number=row["node_number"], title=row["title"], content=row["content"],
            status=row["status"], version=row["version"],
            keywords=repo.get_keywords(row["id"]),
            cross_references=cross_refs_out,
            notes=repo.get_notes(row["id"]),
            children=children,
        )
```

## File: backend/app/api/__init__.py
```
```

## File: backend/app/api/chapters.py
```
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.services.chapter_service import ChapterService, ChapterNotFoundError

router = APIRouter()
chapter_service = ChapterService()

@router.get("/titles")
async def get_titles():
    """Return all titles with their chapters and section counts."""
    return chapter_service.list_titles_with_chapters()

@router.get("/chapter/{chapter_number}")
async def get_chapter(chapter_number: str, title_number: Optional[str] = Query(None)):
    """Return a chapter tree with all its sections and subsections."""
    try:
        return chapter_service.get_chapter(chapter_number, title_number)
    except ChapterNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
```

## File: backend/app/api/interactive.py
```
import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.security import require_edit_access
from app.db.database import get_connection
from app.repositories.highlight_repository import HighlightRepository
from app.repositories.node_repository import NodeRepository

router = APIRouter(prefix="/api", tags=["interactive"])


# ---------- Highlights ----------
class HighlightCreate(BaseModel):
    node_id: int
    start_offset: int
    end_offset: int
    color: str = "#90EE90"

class HighlightOut(BaseModel):
    id: int
    node_id: int
    start_offset: int
    end_offset: int
    color: str
    created_at: str

@router.get("/highlights/{chapter_number}")
def get_highlights(chapter_number: str):
    conn = get_connection()
    try:
        node_repo = NodeRepository(conn)
        chapter = node_repo.type_number_exists("chapter", chapter_number)
        if not chapter:
            raise HTTPException(status_code=404, detail="Chapter not found")
        highlight_repo = HighlightRepository(conn)
        rows = highlight_repo.get_highlights_for_chapter(chapter["id"])
        return [HighlightOut(**dict(r)) for r in rows]
    finally:
        conn.close()

@router.post("/highlights", response_model=HighlightOut)
def create_highlight(hl: HighlightCreate):
    conn = get_connection()
    try:
        node_repo = NodeRepository(conn)
        node = node_repo.get_by_id(hl.node_id)
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")
        if hl.start_offset < 0 or hl.end_offset > len(node["content"] or ""):
            raise HTTPException(status_code=400, detail="Offsets out of range")
        highlight_repo = HighlightRepository(conn)
        hl_id = highlight_repo.add_highlight(hl.node_id, hl.start_offset, hl.end_offset, hl.color)
        conn.commit()
        created = highlight_repo.get_highlights_for_node(hl.node_id)
        for r in created:
            if r["id"] == hl_id:
                return HighlightOut(**dict(r))
        raise HTTPException(status_code=500, detail="Highlight creation failed")
    finally:
        conn.close()

@router.delete("/highlights/{highlight_id}")
def delete_highlight(highlight_id: int):
    conn = get_connection()
    try:
        highlight_repo = HighlightRepository(conn)
        highlight_repo.delete_highlight(highlight_id)
        conn.commit()
        return {"success": True}
    finally:
        conn.close()

@router.put("/highlights/{highlight_id}")
def update_highlight(highlight_id: int, start_offset: int, end_offset: int):
    conn = get_connection()
    try:
        highlight_repo = HighlightRepository(conn)
        highlight_repo.update_highlight(highlight_id, start_offset, end_offset)
        conn.commit()
        return {"success": True}
    finally:
        conn.close()


# ---------- Node content update (now versioned via node_history) ----------
class NodeUpdate(BaseModel):
    content: str = Field(..., min_length=1)
    created_by: Optional[str] = None

@router.put("/nodes/{node_id}")
def update_node_content(node_id: int, update: NodeUpdate, _: None = Depends(require_edit_access)):
    conn = get_connection()
    try:
        node_repo = NodeRepository(conn)
        node = node_repo.get_by_id(node_id)
        if not node:
            raise HTTPException(status_code=404, detail="Node not found")

        snapshot = json.dumps(
            {"content": node["content"], "title": node["title"], "version": node["version"]},
            ensure_ascii=False,
        )
        node_repo.record_history(node_id, node["version"], snapshot, "update", update.created_by)

        conn.execute(
            "UPDATE legal_nodes SET content = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?",
            (update.content, node_id),
        )
        conn.commit()
        return {"success": True, "message": "Content updated"}
    finally:
        conn.close()

@router.get("/highlights/node/{node_id}", response_model=list[HighlightOut])
def get_highlights_for_node(node_id: int):
    conn = get_connection()
    try:
        highlight_repo = HighlightRepository(conn)
        rows = highlight_repo.get_highlights_for_node(node_id)
        return [HighlightOut(**dict(r)) for r in rows]
    finally:
        conn.close()
```

## File: backend/app/api/search.py
```
import re
from typing import Literal

from fastapi import APIRouter, Query
from app.db.database import get_connection

router = APIRouter(prefix="/api", tags=["search"])

# Matches: "102", "section 102", "sec 102", "sec. 102", "§102", "102(a)", "section 102(uu)"
_SECTION_REF_RE = re.compile(
    r'^\s*(?:sec(?:tion)?s?\.?|§)?\s*(\d+[a-zA-Z\-]*)\s*(\([a-zA-Z0-9]+\))?\s*$',
    re.IGNORECASE,
)
# Matches: "chapter 3", "ch. 3", "chapter II-1"
_CHAPTER_REF_RE = re.compile(
    r'^\s*(?:ch(?:apter)?s?\.?)\s*([0-9ivxlcIVXLC\-]+)\s*$',
    re.IGNORECASE,
)
# Matches: "title II", "title 2"
_TITLE_REF_RE = re.compile(
    r'^\s*(?:title)\s*([0-9ivxlcIVXLC\-]+)\s*$',
    re.IGNORECASE,
)


def _row_to_result(row) -> dict:
    keys = row.keys()
    return {
        "node_id": row["node_id"],
        "node_type": row["node_type"],
        "node_number": row["node_number"],
        "title": row["title"],
        "excerpt": row["excerpt"] or (row["content"][:200] if "content" in keys and row["content"] else ""),
        "title_number": row["title_number"],
        "title_title": row["title_title"],
        "chapter_number": row["chapter_number"],
        "chapter_title": row["chapter_title"],
        "exact_match": bool(row["exact_match"]) if "exact_match" in keys else False,
    }


def _direct_lookup(conn, q: str, filter: str):
    """Resolve queries like '102', 'section 102', 'sec. 102', 'chapter 3',
    'title II' straight against node_number — bypassing full-text search
    entirely so the *actual* Section 102 always outranks a page that merely
    mentions "Section 102" somewhere in its text."""
    node_type = None
    number = None

    m = _SECTION_REF_RE.match(q)
    if m and filter in ("all", "section"):
        node_type, number = "section", m.group(1)
    if node_type is None:
        m = _CHAPTER_REF_RE.match(q)
        if m and filter in ("all", "chapter"):
            node_type, number = "chapter", m.group(1)
    if node_type is None:
        m = _TITLE_REF_RE.match(q)
        if m and filter in ("all", "title"):
            node_type, number = "title", m.group(1)

    if node_type is None or not number:
        return []

    row = conn.execute(
        """
        SELECT n.id AS node_id, n.node_type, n.node_number, n.title, n.content,
               substr(n.content, 1, 220) AS excerpt,
               t_parent.node_number AS title_number, t_parent.title AS title_title,
               ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
               1 AS exact_match
        FROM legal_nodes n
        LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
        LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
        WHERE n.node_type = ? AND n.node_number = ?
        LIMIT 1
        """,
        (node_type, number),
    ).fetchone()
    return [row] if row else []


@router.get("/search")
def search(
    q: str = Query(..., min_length=1),
    filter: Literal["all", "title", "chapter", "section"] = Query("all"),
    limit: int = Query(50, ge=1, le=200),
):
    conn = get_connection()
    try:
        q_clean = q.strip()
        results = []
        seen_ids = set()

        # 1. Exact structural match always wins the top spot.
        for row in _direct_lookup(conn, q_clean, filter):
            results.append(_row_to_result(row))
            seen_ids.add((row["node_type"], row["node_id"]))

        # 2. Weighted full-text search as the general keyword fallback.
        #    Tokens are AND-ed (not forced into one rigid phrase like before),
        #    and node_number/title matches are weighted far above raw content
        #    so structural hits outrank incidental mentions.
        tokens = re.findall(r"\w+", q_clean)
        if tokens:
            match_expr = " ".join(f'"{t}"' for t in tokens)
            sql = """
                SELECT s.node_id, n.node_type, n.node_number, n.title, n.content,
                       snippet(search_index, 4, '[', ']', '...', 20) AS excerpt,
                       t_parent.node_number AS title_number, t_parent.title AS title_title,
                       ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
                       0 AS exact_match
                FROM search_index s
                JOIN legal_nodes n ON n.id = s.node_id
                LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
                LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
                WHERE search_index MATCH ?
            """
            params = [match_expr]
            if filter != "all":
                sql += " AND n.node_type = ?"
                params.append(filter)
            sql += " ORDER BY bm25(search_index, 12.0, 6.0, 1.0, 4.0) LIMIT ?"
            params.append(limit)

            try:
                rows = conn.execute(sql, params).fetchall()
            except Exception:
                rows = []

            if not rows:
                and_conditions = []
                all_params = []
                for token in tokens:
                    like = f"%{token}%"
                    and_conditions.append(
                        "(n.node_number LIKE ? OR n.title LIKE ? OR n.content LIKE ? OR n.node_type LIKE ?)"
                    )
                    all_params.extend([like, like, like, like])

                sql = f"""
                    SELECT n.id AS node_id, n.node_type, n.node_number, n.title, n.content,
                           substr(n.content, 1, 200) AS excerpt,
                           t_parent.node_number AS title_number, t_parent.title AS title_title,
                           ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
                           0 AS exact_match
                    FROM legal_nodes n
                    LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
                    LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
                    WHERE {' AND '.join(and_conditions)}
                """
                params = all_params
                if filter != "all":
                    sql += " AND n.node_type = ?"
                    params.append(filter)
                sql += " ORDER BY n.node_type, CAST(n.node_number AS INTEGER) LIMIT ?"
                params.append(limit)
                rows = conn.execute(sql, params).fetchall()

            for row in rows:
                key = (row["node_type"], row["node_id"])
                if key in seen_ids:
                    continue
                seen_ids.add(key)
                results.append(_row_to_result(row))
                if len(results) >= limit:
                    break

        return results[:limit]
    finally:
        conn.close()
```

## File: backend/app/__init__.py
```
```

## File: backend/app/main.py
```
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("customs_law")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    logger.info("Database ready at %s", settings.DATABASE_PATH)
    yield

app = FastAPI(title="Customs Law Platform - RA 10863", lifespan=lifespan)

# CORS
origins = ["*"] if settings.CORS_ORIGINS.strip() == "*" else [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

# Diagnostic endpoint (para malaman kung gumagana ang API)
@app.get("/api/test")
async def test_api():
    return {"message": "API is working"}

# Import routers
try:
    from app.api import chapters as chapters_router
    logger.info("✅ chapters router imported")
except Exception as e:
    logger.error(f"❌ chapters import error: {e}")
    raise

try:
    from app.api import search as search_router
    logger.info("✅ search router imported")
except Exception as e:
    logger.error(f"❌ search import error: {e}")
    raise

try:
    from app.api import interactive as interactive_router
    logger.info("✅ interactive router imported")
except Exception as e:
    logger.error(f"❌ interactive import error: {e}")
    raise

# Isama ang routers na may prefix na "/api"
app.include_router(chapters_router.router, prefix="/api")
app.include_router(search_router.router, prefix="/api")
app.include_router(interactive_router.router, prefix="/api")
logger.info("✅ All routers included with /api prefix")

# I-log ang lahat ng routes pagkatapos ng startup
@app.on_event("startup")
async def log_routes():
    logger.info("=== REGISTERED ROUTES ===")
    for route in app.routes:
        methods = getattr(route, "methods", set())
        logger.info(f"  {route.path} - {methods}")
    logger.info("==========================")

# Serve static files
if os.path.exists("dist"):
    DIST_DIR = os.path.abspath("dist")
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    logger.info(f"✅ Static assets mounted from {DIST_DIR}/assets")
else:
    logger.warning("⚠️ dist folder not found")

# Catch-all for SPA (dapat nasa huli)
@app.get("/{path:path}")
async def serve_react(path: str):
    # Kung ang path ay nagsisimula sa "api/", magbalik ng 404 JSON (hindi HTML)
    if path.startswith("api/"):
        return JSONResponse(
            status_code=404,
            content={"detail": f"API endpoint not found: /{path}"}
        )
    # Serve real files (manifest.json, sw.js, icons, etc.)
    candidate = os.path.abspath(os.path.join(DIST_DIR, path))
    if path and candidate.startswith(DIST_DIR) and os.path.isfile(candidate):
        return FileResponse(candidate)
    # Fallback to index.html para sa SPA
    return FileResponse("dist/index.html")
```

## File: frontend/src/api/customsLawApi.js
```
const API_BASE = "";
export async function searchCMTA(query, filter) {
  const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&filter=${filter}`);
  return res.json();
}
```

## File: frontend/src/pages/ChapterBrowser.jsx
```
import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";
import { searchCMTA } from "../api/customsLawApi";

const API_BASE = "";
const MODE_KEY = "customsLaw_mode";
const FONT_KEY = "customsLaw_fontScale";
const DARK_KEY = "customsLaw_darkMode";

const HighlightUIContext = createContext(null);
function useHighlightUI() { return useContext(HighlightUIContext); }

function useNodeHighlights(nodeId, shouldLoad) {
  const [highlights, setHighlights] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    let ignore = false;
    fetch(`${API_BASE}/api/highlights/node/${nodeId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (!ignore) { setHighlights(data); setLoaded(true); } })
      .catch(console.error);
    return () => { ignore = true; };
  }, [shouldLoad, nodeId, loaded]);
  const addHighlight = useCallback(async (start, end) => {
    try {
      const res = await fetch(`${API_BASE}/api/highlights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId, start_offset: start, end_offset: end, color: "#90EE90" }),
      });
      if (res.ok) { const newHl = await res.json(); setHighlights((prev) => [...prev, newHl]); }
    } catch (e) { console.error(e); }
  }, [nodeId]);
  const removeHighlight = useCallback(async (hlId) => {
    try { await fetch(`${API_BASE}/api/highlights/${hlId}`, { method: "DELETE" }); setHighlights((prev) => prev.filter((h) => h.id !== hlId)); } catch (e) { console.error(e); }
  }, []);
  return { highlights, addHighlight, removeHighlight };
}

function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return [{ text, highlightId: null }];
  const sorted = [...highlights].sort((a, b) => a.start_offset - b.start_offset);
  const segments = [];
  let cursor = 0;
  for (const hl of sorted) {
    if (hl.start_offset > cursor) segments.push({ text: text.slice(cursor, hl.start_offset), highlightId: null });
    segments.push({ text: text.slice(hl.start_offset, hl.end_offset), highlightId: hl.id, color: hl.color });
    cursor = hl.end_offset;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightId: null });
  return segments;
}

function SelectionToolbar({ x, y, kind, onSave, onCancel, onDelete }) {
  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 100 }} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/40">
      {kind === "existing" ? (
        <>
          <button onClick={onDelete} className="flex items-center gap-1 rounded-lg px-3 py-2 min-h-[40px] text-sm font-medium text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/40">
            🗑 Remove highlight
          </button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
        </>
      ) : (
        <>
          <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 min-h-[40px] text-sm font-semibold text-amber-800 active:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:active:bg-amber-900/70">
            🖍 Highlight
          </button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
        </>
      )}
    </div>
  );
}

function HighlightableContent({ nodeId, content, highlights, addHighlight, removeHighlight, className, armed }) {
  const containerRef = useRef(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [toolbar, setToolbar] = useState(null);
  useEffect(() => {
    if (!armed) { setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return; }
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !containerRef.current || !containerRef.current.contains(sel.anchorNode)) {
        setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return;
      }
      const range = sel.getRangeAt(0);
      const preRange = document.createRange();
      preRange.selectNodeContents(containerRef.current);
      preRange.setEnd(range.startContainer, range.startOffset);
      const start = preRange.toString().length;
      const end = start + range.toString().length;
      if (start >= end) return;
      setPendingSelection({ start, end });
      const rect = range.getBoundingClientRect();
      setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "selection" });
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [armed]);
  const handleMarkClick = (e, hlId) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "existing", hlId });
    setPendingSelection(null);
  };
  const closeToolbar = () => { setToolbar(null); setPendingSelection(null); window.getSelection()?.removeAllRanges(); };
  const confirmHighlight = async () => { if (!pendingSelection) return; await addHighlight(pendingSelection.start, pendingSelection.end); closeToolbar(); };
  const confirmDelete = async () => { if (!toolbar?.hlId) return; await removeHighlight(toolbar.hlId); closeToolbar(); };
  const segments = applyHighlights(content, highlights);
  return (
    <div className="relative">
      <div ref={containerRef} className={`${className} ${armed ? "rounded-lg bg-amber-50/70 ring-1 ring-amber-300 dark:bg-amber-950/30 dark:ring-amber-700" : ""}`}>
        {segments.map((seg, i) =>
          seg.highlightId ? (
            <mark key={i} style={{ backgroundColor: seg.color }} className="cursor-pointer rounded-sm px-0.5" onClick={(e) => handleMarkClick(e, seg.highlightId)}>{seg.text}</mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
      {toolbar && <SelectionToolbar x={toolbar.x} y={toolbar.y} kind={toolbar.kind} onSave={confirmHighlight} onDelete={confirmDelete} onCancel={closeToolbar} />}
    </div>
  );
}

function EditBox({ nodeId, initialContent, onSaved, onCancel }) {
  const [text, setText] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/nodes/${nodeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
      if (!res.ok) throw new Error("Save failed");
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  return (
    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: "16px" }}
        className="w-full rounded-xl border border-slate-300 p-3 leading-relaxed shadow-inner focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-navy-400 dark:focus:ring-navy-400/20"
        rows={Math.max(3, text.split("\n").length)}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button onClick={save} disabled={saving} className="min-h-[40px] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm active:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-700 dark:active:bg-emerald-800">
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button onClick={onCancel} className="min-h-[40px] rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 active:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:active:bg-slate-600">Cancel</button>
      </div>
    </div>
  );
}

const STUDY_TYPE_STYLES = {
  chapter: "text-xl sm:text-2xl font-bold text-navy-900 dark:text-slate-50",
  section: "text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200",
  paragraph: "text-base sm:text-lg text-slate-700 dark:text-slate-300",
  subparagraph: "text-base text-slate-600 dark:text-slate-400",
  item: "text-sm text-slate-500 dark:text-slate-500",
};

function StudyNodeRenderer({ node, level = 0, onRefresh, expandedSet = new Set(), scrollToId = null }) {
  const nodeRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const { activeHighlightNodeId, setActiveHighlightNodeId } = useHighlightUI();
  const isHighlighting = activeHighlightNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = hasChildren || !!node.content;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, expanded);

  useEffect(() => {
    if (expandedSet.has(node.id)) setExpanded(true);
  }, [expandedSet, node.id]);

  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("ring-2", "ring-amber-400", "bg-amber-50", "dark:bg-amber-900/40");
        setTimeout(() => nodeRef.current?.classList.remove("ring-2", "ring-amber-400", "bg-amber-50", "dark:bg-amber-900/40"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const toggle = (e) => { e.stopPropagation(); if (isExpandable) setExpanded((v) => !v); };

  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 6) * 0.9}rem` }} className="my-1 rounded-xl transition-colors">
      <div onClick={toggle} role="button" tabIndex={0} className="flex items-start gap-2 rounded-xl px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer touch-manipulation dark:hover:bg-slate-800/60 dark:active:bg-slate-800">
        <span className="mt-1 w-4 flex-shrink-0 select-none text-sm text-slate-400 dark:text-slate-600">{isExpandable ? (expanded ? "▾" : "▸") : ""}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {node.node_type === "chapter" && (
              <span className="inline-block rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-navy-700">
                Chapter {node.node_number}
              </span>
            )}
            {node.node_type === "section" && (
              <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Sec. {node.node_number}
              </span>
            )}
            <span className={STUDY_TYPE_STYLES[node.node_type] || "text-sm text-slate-700 dark:text-slate-300"}>{node.title || node.node_number}</span>
          </div>

          {expanded && node.content && (
            <div onClick={(e) => e.stopPropagation()} className="mt-2">
              {editing ? (
                <EditBox nodeId={node.id} initialContent={node.content} onSaved={() => { setEditing(false); onRefresh(); }} onCancel={() => setEditing(false)} />
              ) : (
                <>
                  <HighlightableContent
                    nodeId={node.id}
                    content={node.content}
                    highlights={highlights}
                    addHighlight={addHighlight}
                    removeHighlight={removeHighlight}
                    armed={isHighlighting}
                    className="select-text rounded-lg p-2 text-base leading-relaxed text-slate-700 dark:text-slate-300"
                  />
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <button onClick={() => setEditing(true)} className="min-h-[38px] rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700">
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => setActiveHighlightNodeId(isHighlighting ? null : node.id)}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isHighlighting
                          ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:active:bg-emerald-950/50"
                      }`}
                    >
                      {isHighlighting ? "Select text to highlight…" : "🖍 Highlight"}
                    </button>
                  </div>
                  {node.cross_references && node.cross_references.length > 0 && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60" onClick={(e) => e.stopPropagation()}>
                      <span className="font-medium text-slate-700 dark:text-slate-300">See Also</span>
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400">
                        {node.cross_references.map((ref, idx) => (
                          <li key={idx}>
                            {ref.url ? (
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700">{ref.text}</a>
                            ) : (
                              <span>{ref.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {expanded && node.keywords?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
              {node.keywords.map((kw) => <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">{kw}</span>)}
            </div>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="ml-4 border-l border-slate-100 dark:border-slate-800">
          {node.children.map((child) => (
            <StudyNodeRenderer key={child.id} node={child} level={level + 1} onRefresh={onRefresh} expandedSet={expandedSet} scrollToId={scrollToId} />
          ))}
        </div>
      )}
    </div>
  );
}

const READING_TYPE_STYLES = {
  chapter: "font-bold text-navy-900 dark:text-slate-50 mb-2",
  section: "font-semibold text-slate-900 dark:text-slate-100 mb-1",
  paragraph: "text-slate-800 dark:text-slate-300",
  subparagraph: "text-slate-800 dark:text-slate-300",
  item: "text-slate-700 dark:text-slate-400",
};

function ReadingNodeRenderer({ node, level = 0, fontScale, expandedSet = new Set(), scrollToId = null }) {
  const nodeRef = useRef(null);
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, !!node.content);

  useEffect(() => {
    if (expandedSet.has(node.id)) setExpanded(true);
  }, [expandedSet, node.id]);

  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("bg-amber-50", "dark:bg-amber-900/40");
        setTimeout(() => nodeRef.current?.classList.remove("bg-amber-50", "dark:bg-amber-900/40"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const toggle = (e) => { e.stopPropagation(); if (hasChildren) setExpanded((v) => !v); };
  const headingSize = node.node_type === "chapter" ? 1.6 : node.node_type === "section" ? 1.3 : 1;

  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 4) * 0.6}rem` }} className="my-4 rounded-lg transition-colors">
      <div onClick={toggle} className={`font-serif ${READING_TYPE_STYLES[node.node_type] || "text-slate-800 dark:text-slate-200"} ${hasChildren ? "cursor-pointer" : ""}`} style={{ fontSize: `${headingSize * fontScale}rem` }}>
        {node.node_type === "section" && `Section ${node.node_number}. `}
        {node.node_type === "chapter" && `Chapter ${node.node_number}. `}
        {node.title || node.node_number}
      </div>
      {node.content && (
        <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={true} className="select-text font-serif leading-loose text-slate-800 dark:text-slate-300" />
      )}
      {node.cross_references && node.cross_references.length > 0 && (
        <div className="mt-2 rounded-lg bg-slate-50 p-3 font-sans text-sm dark:bg-slate-800/60">
          <span className="font-medium text-slate-700 dark:text-slate-300">See Also</span>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400">
            {node.cross_references.map((ref, idx) => (
              <li key={idx}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700">{ref.text}</a>
                ) : (
                  <span>{ref.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {expanded && hasChildren && (
        <div>{node.children.map((child) => <ReadingNodeRenderer key={child.id} node={child} level={level + 1} fontScale={fontScale} expandedSet={expandedSet} scrollToId={scrollToId} />)}</div>
      )}
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  return (
    <div className="inline-flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800" role="tablist" aria-label="View mode">
      <button role="tab" aria-selected={mode === "study"} onClick={() => setMode("study")} className={`min-h-[36px] rounded-full px-3 py-1.5 transition-colors ${mode === "study" ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>📘 Study</button>
      <button role="tab" aria-selected={mode === "reading"} onClick={() => setMode("reading")} className={`min-h-[36px] rounded-full px-3 py-1.5 transition-colors ${mode === "reading" ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>📖 Reading</button>
    </div>
  );
}

function FontStepper({ fontScale, setFontScale }) {
  const clamp = (v) => Math.min(1.6, Math.max(0.85, v));
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <button onClick={() => setFontScale((s) => clamp(s - 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700" aria-label="Decrease font size">A-</button>
      <span className="w-10 text-center text-xs text-slate-400 dark:text-slate-500">{Math.round(fontScale * 100)}%</span>
      <button onClick={() => setFontScale((s) => clamp(s + 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700" aria-label="Increase font size">A+</button>
    </div>
  );
}

function ReadingProgressBar({ containerRef }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => { const max = el.scrollHeight - el.clientHeight; setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0); };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);
  return (
    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-navy-700 transition-all dark:from-amber-500 dark:to-navy-400" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FilterChip({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-navy-900 bg-navy-900 text-white dark:border-navy-600 dark:bg-navy-700"
          : "border-slate-200 bg-white text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

function SearchResultCard({ item, onClick }) {
  const buildPath = () => {
    const parts = [];
    if (item.title_number) parts.push(`TITLE ${item.title_number}`);
    if (item.chapter_number) parts.push(`Ch. ${item.chapter_number}`);
    if (item.node_type === "section") parts.push(`Sec. ${item.node_number}`);
    return parts.join(" · ") || item.node_type.toUpperCase();
  };
  const typeColors = {
    title: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    chapter: "bg-navy-900 text-white dark:bg-navy-700",
    section: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    paragraph: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    subparagraph: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    item: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-2xl border bg-white p-4 text-left shadow-card transition active:scale-[0.99] active:bg-slate-50 dark:bg-slate-800 dark:active:bg-slate-700/70 ${
        item.exact_match ? "border-amber-400 ring-1 ring-amber-300 dark:border-amber-600 dark:ring-amber-700" : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-md px-1.5 py-0.5 font-semibold uppercase tracking-wide ${typeColors[item.node_type] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
            {item.node_type}
          </span>
          <span className="text-slate-400 dark:text-slate-500">{buildPath()}</span>
        </div>
        {item.exact_match && (
          <span className="flex-shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950 dark:bg-amber-500 dark:text-amber-950">✓ Exact match</span>
        )}
      </div>
      <div className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">{item.title || item.node_number}</div>
      {item.excerpt && (
        <div className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: item.excerpt.replace(/\[/g, "<mark>").replace(/\]/g, "</mark>") }} />
      )}
      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-navy-700 dark:text-amber-400">Open <span aria-hidden>→</span></div>
    </button>
  );
}

function SearchView({ onNavigateChapter }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setHasSearched(true);
    try {
      const data = await searchCMTA(query.trim(), filter);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally { setLoading(false); }
  }, [query, filter]);

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const clearQuery = () => { setQuery(""); setResults([]); setHasSearched(false); inputRef.current?.focus(); };
  const handleResultClick = (item) => { onNavigateChapter(item.chapter_number, item.title_number, item.node_number); };

  const exactResults = results.filter((r) => r.exact_match);
  const otherResults = results.filter((r) => !r.exact_match);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <span className="pl-1 text-lg text-slate-400 dark:text-slate-500" aria-hidden>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search e.g. "Section 102" or "smuggling"'
            className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            style={{ fontSize: "16px" }}
          />
          {query && (
            <button onClick={clearQuery} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-700" aria-label="Clear search">✕</button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="All" value="all" active={filter === "all"} onClick={setFilter} />
            <FilterChip label="Title" value="title" active={filter === "title"} onClick={setFilter} />
            <FilterChip label="Chapter" value="chapter" active={filter === "chapter"} onClick={setFilter} />
            <FilterChip label="Section" value="section" active={filter === "section"} onClick={setFilter} />
          </div>
          <button onClick={handleSearch} disabled={loading || !query.trim()} className="min-h-[38px] flex-shrink-0 rounded-full bg-navy-900 px-5 py-1.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 disabled:opacity-40 dark:bg-navy-700 dark:active:bg-navy-600">
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}

      {loading && (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100 dark:bg-slate-700/60" />
            </div>
          ))}
        </div>
      )}

      {!loading && exactResults.length > 0 && (
        <div className="mt-5 space-y-2">
          {exactResults.map((item, idx) => <SearchResultCard key={`exact-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}
        </div>
      )}

      {!loading && otherResults.length > 0 && (
        <div className="mt-5">
          {exactResults.length > 0 && <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Related mentions</p>}
          <div className="space-y-2">
            {otherResults.map((item, idx) => <SearchResultCard key={`other-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}
          </div>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && !error && (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600">
          <span className="text-3xl">🔎</span>
          <p className="text-base font-medium text-slate-500 dark:text-slate-400">No results for "{query}"</p>
          <p className="text-sm">Try a section number (e.g. 102), a keyword, or a shorter phrase.</p>
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600">
          <span className="text-3xl">📚</span>
          <p className="text-sm">Search the full text of RA 10863 — titles, chapters, sections, and definitions.</p>
        </div>
      )}
    </div>
  );
}

function DarkModeToggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${
        enabled ? "bg-navy-700" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsView({ darkMode, setDarkMode }) {
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Customize your reading experience.</p>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Appearance</h2>
        <div className="flex items-center justify-between gap-4 rounded-xl py-1">
          <div className="min-w-0">
            <p className="font-medium text-slate-800 dark:text-slate-100">🌙 Dark Mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Easier on the eyes in low light.</p>
          </div>
          <DarkModeToggle enabled={darkMode} onChange={setDarkMode} />
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">About this App</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          RA 10863 — Customs Modernization and Tariff Act. A study &amp; reading companion with search, highlights, and offline support.
        </p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Version 1.0.0</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Developer</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-white dark:bg-navy-700">
            O
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-100">Osias</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">App developer &amp; maintainer</p>
          </div>
        </div>
        <a
          href="https://osiasnalaunan68-star.github.io/osias-personal-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600"
        >
          🌐 View Developer Portfolio
        </a>
      </section>
    </div>
  );
}

function findNodeAndAncestors(node, targetNumber, ancestors = []) {
  if (node.node_number === targetNumber) return { found: true, ancestors };
  if (node.children) {
    for (const child of node.children) {
      const result = findNodeAndAncestors(child, targetNumber, [...ancestors, node.id]);
      if (result.found) return result;
    }
  }
  return { found: false };
}

export default function ChapterBrowser() {
  const [view, setView] = useState("browse");
  const [titles, setTitles] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTitleNumber, setSelectedTitleNumber] = useState(null);
  const [chapterTree, setChapterTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);
  const [mode, setMode] = useState(() => (typeof window === "undefined" ? "study" : localStorage.getItem(MODE_KEY) || "study"));
  const [fontScale, setFontScale] = useState(() => { if (typeof window === "undefined") return 1; const saved = parseFloat(localStorage.getItem(FONT_KEY)); return Number.isFinite(saved) ? saved : 1; });
  const [darkMode, setDarkMode] = useState(() => (typeof window === "undefined" ? false : localStorage.getItem(DARK_KEY) === "true"));
  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState(new Set());
  const [scrollToNodeId, setScrollToNodeId] = useState(null);
  const [collapsedTitles, setCollapsedTitles] = useState({});
  const mainRef = useRef(null);

  useEffect(() => localStorage.setItem(MODE_KEY, mode), [mode]);
  useEffect(() => localStorage.setItem(FONT_KEY, String(fontScale)), [fontScale]);
  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetch(`${API_BASE}/api/titles`).then((r) => r.json()).then(setTitles).catch((err) => setError(err.message));
  }, []);

  const loadChapter = useCallback(async (chapterNumber, titleNumber = null, focusSectionNumber = null) => {
    setLoading(true); setError(null);
    try {
      const url = titleNumber
        ? `${API_BASE}/api/chapter/${chapterNumber}?title_number=${encodeURIComponent(titleNumber)}`
        : `${API_BASE}/api/chapter/${chapterNumber}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Chapter not found");
      const data = await res.json();
      setChapterTree(data);
      setSelectedChapter(chapterNumber);
      setSelectedTitleNumber(titleNumber);
      setView("browse");
      setSidebarOpen(window.innerWidth >= 768);
      if (mainRef.current) mainRef.current.scrollTop = 0;

      if (focusSectionNumber && data) {
        const { found, ancestors } = findNodeAndAncestors(data, focusSectionNumber);
        if (found) {
          setExpandedNodeIds(new Set(ancestors));
          let targetId = null;
          const walk = (node) => {
            if (node.node_number === focusSectionNumber && node.node_type === "section") { targetId = node.id; return true; }
            if (node.children) { for (const child of node.children) { if (walk(child)) return true; } }
            return false;
          };
          walk(data);
          setScrollToNodeId(targetId);
        }
      } else {
        setExpandedNodeIds(new Set());
        setScrollToNodeId(null);
      }
    } catch (err) {
      setError(err.message);
      setChapterTree(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshChapter = () => { if (selectedChapter) loadChapter(selectedChapter, selectedTitleNumber); };
  const toggleTitleCollapse = (key) => { setCollapsedTitles((prev) => ({ ...prev, [key]: !prev[key] })); };
  const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId }), [activeHighlightNodeId]);

  return (
    <HighlightUIContext.Provider value={highlightUIValue}>
      <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
        {sidebarOpen && view === "browse" && (
          <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {view === "browse" && (
          <aside
            className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:w-80 md:max-w-none md:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>⚖️</span>
                <div>
                  <h2 className="text-base font-bold leading-tight text-navy-900 dark:text-slate-50">RA 10863</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Customs Modernization &amp; Tariff Act</p>
                </div>
              </div>
            </div>
            <div className="p-3">
              {error && <p className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}
              {titles.map((titleGroup) => {
                const key = titleGroup.title_number || "root";
                const collapsed = collapsedTitles[key];
                return (
                  <div key={key} className="mb-2">
                    <button onClick={() => toggleTitleCollapse(key)} className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-50 dark:active:bg-slate-800">
                      <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">
                        {titleGroup.title_number ? `Title ${titleGroup.title_number}` : titleGroup.title_title}
                      </span>
                      <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
                    </button>
                    {!collapsed && (
                      <ul className="ml-1 space-y-0.5 border-l border-slate-100 pl-2 dark:border-slate-800">
                        {titleGroup.chapters.map((ch) => {
                          const active = selectedChapter === ch.node_number && selectedTitleNumber === titleGroup.title_number;
                          return (
                            <li key={ch.id}>
                              <button
                                onClick={() => loadChapter(ch.node_number, titleGroup.title_number)}
                                className={`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                  active ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-600 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"
                                }`}
                              >
                                <span className="block truncate">Ch. {ch.node_number}: {ch.title}</span>
                                <span className={`text-xs ${active ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>{ch.section_count} section{ch.section_count !== 1 ? "s" : ""}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex items-center gap-2 px-3 py-2">
              {view === "browse" && (
                <button onClick={() => setSidebarOpen((v) => !v)} className="flex h-10 w-10 flex-shrink-0 touch-manipulation items-center justify-center rounded-full text-lg text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800" aria-label="Toggle chapter list">
                  {sidebarOpen ? "✕" : "☰"}
                </button>
              )}
              <div className="flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
                <button onClick={() => setView("browse")} className={`min-h-[36px] rounded-full px-3 py-1.5 font-medium transition-colors ${view === "browse" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>Browse</button>
                <button onClick={() => setView("search")} className={`min-h-[36px] rounded-full px-3 py-1.5 font-medium transition-colors ${view === "search" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>Search</button>
                <button onClick={() => setView("settings")} aria-label="Settings" className={`min-h-[36px] rounded-full px-3 py-1.5 font-medium transition-colors ${view === "settings" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>⚙️</button>
              </div>
              {view === "browse" && (
                <>
                  <span className="min-w-0 flex-1 truncate px-1 text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-base">
                    {chapterTree ? chapterTree.title || `Chapter ${chapterTree.node_number}` : "Select a chapter"}
                  </span>
                  <ModeToggle mode={mode} setMode={setMode} />
                </>
              )}
              {(view === "search" || view === "settings") && <span className="flex-1" />}
            </div>
            {view === "browse" && mode === "reading" && (
              <div className="flex items-center justify-end gap-2 px-3 pb-2">
                <FontStepper fontScale={fontScale} setFontScale={setFontScale} />
              </div>
            )}
            {view === "browse" && mode === "reading" && chapterTree && <ReadingProgressBar containerRef={mainRef} />}
          </div>

          <main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
            {view === "search" ? (
              <SearchView onNavigateChapter={loadChapter} />
            ) : view === "settings" ? (
              <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />
            ) : (
              <>
                {loading && (
                  <div className="mx-auto max-w-3xl space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                        <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                        <div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
                        <div className="mt-2 h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
                      </div>
                    ))}
                  </div>
                )}
                {!loading && !chapterTree && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-slate-400 dark:text-slate-600">
                    <span className="text-4xl">📖</span>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Select a chapter to start {mode === "reading" ? "reading" : "studying"}</p>
                    <p className="text-sm">Use the menu button or Search to find what you need.</p>
                  </div>
                )}
                {chapterTree && mode === "study" && (
                  <div className="mx-auto max-w-3xl">
                    {chapterTree.content && <p className="mb-4 rounded-xl bg-white p-4 text-base text-slate-600 shadow-card dark:bg-slate-900 dark:text-slate-300">{chapterTree.content}</p>}
                    <div className="space-y-1">
                      {chapterTree.children.map((section) => (
                        <StudyNodeRenderer key={section.id} node={section} level={0} onRefresh={refreshChapter} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} />
                      ))}
                    </div>
                  </div>
                )}
                {chapterTree && mode === "reading" && (
                  <div className="mx-auto max-w-[70ch]">
                    {chapterTree.content && <p className="mb-4 font-serif text-slate-700 dark:text-slate-300" style={{ fontSize: `${1.05 * fontScale}rem` }}>{chapterTree.content}</p>}
                    {chapterTree.children.map((section) => (
                      <ReadingNodeRenderer key={section.id} node={section} level={0} fontScale={fontScale} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </HighlightUIContext.Provider>
  );
}
```

## File: frontend/src/main.jsx
```
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChapterBrowser from "./pages/ChapterBrowser";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChapterBrowser />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Register the service worker so previously visited chapters/searches
// keep working even offline, and so the app qualifies as an installable
// PWA (needed later for packaging into an Android APK).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
```

## File: frontend/public/manifest.json
```
{
  "name": "RA 10863 - Customs Modernization and Tariff Act",
  "short_name": "CMTA Law",
  "description": "Study and reference companion for the Customs Modernization and Tariff Act (RA 10863) of the Philippines, with search, highlights, and offline support.",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## File: frontend/public/sw.js
```
// Minimal offline-support service worker.
// Strategy: try the network first (so data stays fresh when online),
// and fall back to cache when the request fails (offline / weak signal).
// Every successful GET response gets cached automatically, so chapters,
// search results, and app files you've already opened once will keep
// working with no internet connection.

const CACHE_NAME = "cmta-app-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = await caches.match("/");
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
```

