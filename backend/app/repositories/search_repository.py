import sqlite3
from typing import List


class SearchRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def delete_for_nodes(self, node_ids: List[int]) -> None:
        if not node_ids:
            return
        placeholders = ",".join("?" for _ in node_ids)
        self.conn.execute(
            f"DELETE FROM search_index WHERE node_id IN ({placeholders})", node_ids
        )

    def index_node(
        self, node_id: int, node_type: str, node_number: str, title: str, content: str, keywords: str
    ) -> None:
        self.conn.execute(
            """
            INSERT INTO search_index (node_id, node_type, node_number, title, content, keywords)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (node_id, node_type, node_number or "", title or "", content or "", keywords or ""),
        )

    def clear_all(self) -> None:
        self.conn.execute("DELETE FROM search_index")

    def count(self) -> int:
        row = self.conn.execute("SELECT COUNT(*) as c FROM search_index").fetchone()
        return row["c"]

    def search(self, query: str, limit: int = 20) -> List[sqlite3.Row]:
        return self.conn.execute(
            """
            SELECT node_id, node_type, node_number, title,
                   snippet(search_index, 4, '[', ']', '...', 10) as excerpt
            FROM search_index WHERE search_index MATCH ? LIMIT ?
            """,
            (query, limit),
        ).fetchall()
