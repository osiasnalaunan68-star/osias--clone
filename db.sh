#!/bin/bash
set -e

# 1) Gawin ang python builder script
cat > build_db.py << 'PYEOF'
import json
import sqlite3
from pathlib import Path

INPUT_JSON = "ra10863_full.json"
OUTPUT_DB = "customs_law.db"


def main():
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    db_path = Path(OUTPUT_DB)
    if db_path.exists():
        db_path.unlink()

    conn = sqlite3.connect(OUTPUT_DB)
    cur = conn.cursor()

    cur.executescript("""
        CREATE TABLE legal_nodes (
            id INTEGER PRIMARY KEY,
            uuid TEXT,
            parent_id INTEGER,
            node_type TEXT NOT NULL,
            node_number TEXT,
            title TEXT,
            content TEXT,
            status TEXT,
            version INTEGER,
            depth INTEGER,
            sort_order INTEGER
        );

        CREATE TABLE node_keywords (
            node_id INTEGER,
            keyword TEXT
        );

        CREATE TABLE node_cross_references (
            node_id INTEGER,
            reference_text TEXT,
            url TEXT,
            display_text TEXT
        );

        CREATE TABLE node_notes (
            node_id INTEGER,
            note_text TEXT
        );

        CREATE INDEX idx_nodes_parent ON legal_nodes(parent_id);
        CREATE INDEX idx_nodes_type_number ON legal_nodes(node_type, node_number);
        CREATE INDEX idx_keywords_node ON node_keywords(node_id);
        CREATE INDEX idx_xref_node ON node_cross_references(node_id);
        CREATE INDEX idx_notes_node ON node_notes(node_id);
    """)

    sort_counter = 0

    def next_sort():
        nonlocal sort_counter
        sort_counter += 1
        return sort_counter

    def insert_node(parent_id, node_type, node_number, title, content, status, version, depth):
        cur.execute(
            """INSERT INTO legal_nodes
               (uuid, parent_id, node_type, node_number, title, content, status, version, depth, sort_order)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            ("", parent_id, node_type, node_number, title, content,
             status or "published", version or 1, depth, next_sort())
        )
        return cur.lastrowid

    def insert_keywords(node_id, keywords):
        for kw in keywords or []:
            cur.execute("INSERT INTO node_keywords (node_id, keyword) VALUES (?, ?)", (node_id, kw))

    def insert_cross_refs(node_id, refs):
        for ref in refs or []:
            if isinstance(ref, str):
                cur.execute(
                    "INSERT INTO node_cross_references (node_id, reference_text, url, display_text) VALUES (?, ?, ?, ?)",
                    (node_id, ref, None, None)
                )
            elif isinstance(ref, dict):
                cur.execute(
                    "INSERT INTO node_cross_references (node_id, reference_text, url, display_text) VALUES (?, ?, ?, ?)",
                    (node_id, ref.get("reference_text"), ref.get("url"), ref.get("display_text"))
                )

    def insert_notes(node_id, notes):
        for note in notes or []:
            if isinstance(note, str):
                cur.execute("INSERT INTO node_notes (node_id, note_text) VALUES (?, ?)", (node_id, note))
            elif isinstance(note, dict):
                cur.execute("INSERT INTO node_notes (node_id, note_text) VALUES (?, ?)",
                            (node_id, note.get("note_text") or note.get("text")))

    def insert_recursive(parent_id, node_json, depth):
        node_id = insert_node(
            parent_id,
            node_json.get("node_type"),
            node_json.get("node_number"),
            node_json.get("title"),
            node_json.get("content"),
            node_json.get("status"),
            node_json.get("version"),
            depth,
        )
        insert_keywords(node_id, node_json.get("keywords"))
        insert_cross_refs(node_id, node_json.get("cross_references"))
        insert_notes(node_id, node_json.get("notes"))
        for child in node_json.get("children") or []:
            insert_recursive(node_id, child, depth + 1)
        return node_id

    title_ids = {}

    for entry in data:
        title_number = entry["title_number"]

        if title_number not in title_ids:
            title_ids[title_number] = insert_node(
                None, "title", title_number, entry["title_title"], None, "published", 1, 0
            )

        chapter_id = insert_node(
            title_ids[title_number], "chapter", entry["chapter_number"],
            entry["chapter_title"], None, "published", 1, 1
        )

        for section in entry.get("sections", []):
            insert_recursive(chapter_id, section, 2)

    conn.commit()
    total = cur.execute("SELECT COUNT(*) FROM legal_nodes").fetchone()[0]
    titles = cur.execute("SELECT COUNT(*) FROM legal_nodes WHERE node_type='title'").fetchone()[0]
    chapters = cur.execute("SELECT COUNT(*) FROM legal_nodes WHERE node_type='chapter'").fetchone()[0]
    sections = cur.execute("SELECT COUNT(*) FROM legal_nodes WHERE node_type='section'").fetchone()[0]
    conn.close()
    print(f"Done. {total} total nodes ({titles} titles, {chapters} chapters, {sections} sections) -> {OUTPUT_DB}")


if __name__ == "__main__":
    main()
PYEOF

# 2) I-check kung nandito ang source json (dapat kasabay ng sh.sh sa root)
if [ ! -f "ra10863_full.json" ]; then
  echo "ERROR: 'ra10863_full.json' not found sa $(pwd). Ilagay muna dito bago patakbuhin ulit."
  exit 1
fi

# 3) Buuin ang database
python3 build_db.py

# 4) I-deploy sa frontend/public (dito kinukuha ng dev server / fetch())
mkdir -p frontend/public
cp -f customs_law.db frontend/public/customs_law.db

# 5) I-deploy din sa docs/ (production build na naka-serve sa GitHub Pages)
if [ -d "docs" ]; then
  cp -f customs_law.db docs/customs_law.db
  echo "-> Na-copy din sa docs/customs_law.db (GitHub Pages)"
fi

echo "OK: customs_law.db ay nasa frontend/public/ at docs/ na ngayon."
echo "I-restart ang 'npm run dev' (o i-hard refresh ang browser: Ctrl/Cmd+Shift+R)."
