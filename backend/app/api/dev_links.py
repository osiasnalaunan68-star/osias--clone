from fastapi import APIRouter, Depends, HTTPException
from app.core.security import require_dev_access
from app.db.database import get_connection
from app.models.schemas import BulkLinkUpdate
from app.repositories.node_repository import NodeRepository

router = APIRouter(
    prefix="/api/dev",
    tags=["development-links"],
    dependencies=[Depends(require_dev_access)],
)


@router.put("/bulk-links")
def bulk_links(payload: BulkLinkUpdate):
    conn = get_connection()
    repo = NodeRepository(conn)
    try:
        for item in payload.updates:
            section = repo.type_number_exists("section", item.section_number)
            if section is None:
                raise HTTPException(status_code=404, detail=f"Section {item.section_number} not found")
            repo.clear_cross_references(section["id"])
            for link in item.links:
                repo.add_cross_reference(section["id"], link.text, link.url, link.text)
        conn.commit()
        return {"success": True, "message": f"Updated links for {len(payload.updates)} section(s)"}
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
