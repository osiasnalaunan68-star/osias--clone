from fastapi import APIRouter, HTTPException, Query
from app.db.database import get_db
from app.models import Title, Chapter, Section
from sqlalchemy.orm import Session
from typing import Optional

router = APIRouter()

@router.get("/titles")
async def get_titles():
    """Return all titles with their chapters and section counts."""
    db: Session = next(get_db())
    titles = db.query(Title).all()
    result = []
    for title in titles:
        chapters = db.query(Chapter).filter(Chapter.title_id == title.id).all()
        chapter_list = []
        for ch in chapters:
            section_count = db.query(Section).filter(Section.chapter_id == ch.id).count()
            chapter_list.append({
                "id": ch.id,
                "node_number": ch.node_number,
                "title": ch.title,
                "section_count": section_count,
            })
        result.append({
            "title_number": title.title_number,
            "title_title": title.title,
            "chapters": chapter_list,
        })
    return result

@router.get("/chapter/{chapter_number}")
async def get_chapter(chapter_number: int, title_number: Optional[str] = Query(None)):
    """Return a chapter tree with all its sections and subsections."""
    db: Session = next(get_db())
    query = db.query(Chapter).filter(Chapter.node_number == chapter_number)
    if title_number:
        title = db.query(Title).filter(Title.title_number == title_number).first()
        if not title:
            raise HTTPException(404, "Title not found")
        query = query.filter(Chapter.title_id == title.id)
    chapter = query.first()
    if not chapter:
        raise HTTPException(404, "Chapter not found")
    return build_tree(chapter, db)

def build_tree(node, db):
    """Recursively build a node tree with children."""
    children = []
    if node.node_type == "chapter":
        sections = db.query(Section).filter(Section.chapter_id == node.id).all()
        for sec in sections:
            children.append(build_tree(sec, db))
    elif node.node_type == "section":
        subs = db.query(Section).filter(Section.parent_id == node.id).all()
        for sub in subs:
            children.append(build_tree(sub, db))
    return {
        "id": node.id,
        "node_number": node.node_number,
        "node_type": node.node_type,
        "title": node.title,
        "content": node.content,
        "keywords": node.keywords or [],
        "cross_references": node.cross_references or [],
        "children": children,
    }
