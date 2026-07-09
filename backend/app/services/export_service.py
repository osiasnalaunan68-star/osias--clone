from app.db.database import get_connection
from app.repositories.node_repository import NodeRepository
from app.services.chapter_service import ChapterNotFoundError

class ExportService:
    def export_chapter(self, chapter_number: str, title_number: str | None = None) -> dict:
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
            return self._export_node(repo, chapter)
        finally:
            conn.close()

    def export_title(self, title_number: str) -> list[dict]:
        """Export all chapters under a given title as a list of import‑ready payloads."""
        conn = get_connection()
        try:
            repo = NodeRepository(conn)
            title_row = repo.type_number_exists("title", title_number)
            if not title_row:
                raise ChapterNotFoundError(f"Title {title_number} not found")
            # Fetch full rows so _export_node has all columns
            chapters = conn.execute(
                "SELECT * FROM legal_nodes WHERE parent_id = ? AND node_type = 'chapter' ORDER BY CAST(node_number AS INTEGER) ASC",
                (title_row["id"],)
            ).fetchall()
            result = []
            for ch in chapters:
                chapter_data = self._export_node(repo, ch)
                result.append({
                    "title_number": title_number,
                    "title_title": title_row["title"],
                    "chapter_number": ch["node_number"],
                    "chapter_title": ch["title"],
                    "sections": chapter_data.get("children", [])
                })
            return result
        finally:
            conn.close()

    def _export_node(self, repo: NodeRepository, row) -> dict:
        children = [self._export_node(repo, c) for c in repo.get_children(row["id"])]
        xrefs = repo.get_cross_references(row["id"])
        cross_refs = []
        for x in xrefs:
            if x["url"]:
                cross_refs.append({"reference_text": x["text"], "url": x["url"]})
            else:
                cross_refs.append(x["text"])
        return {
            "node_type": row["node_type"],
            "node_number": row["node_number"],
            "title": row["title"],
            "content": row["content"],
            "status": row["status"],
            "version": row["version"],
            "keywords": repo.get_keywords(row["id"]),
            "cross_references": cross_refs,
            "notes": repo.get_notes(row["id"]),
            "children": children,
        }
