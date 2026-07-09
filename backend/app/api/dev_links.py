from fastapi import APIRouter, HTTPException, status
from app.core.config import settings as app_settings
from app.db.database import get_connection
from app.models.schemas import BulkLinkUpdate
from app.repositories.node_repository import NodeRepository

router = APIRouter(prefix="/api/dev", tags=["development-links"])

def _check_enabled():
    if not app_settings.DEV_PANEL_ENABLED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

@router.put("/bulk-links")
def bulk_links(payload: BulkLinkUpdate):
    _check_enabled()
    conn = get_connection()
    repo = NodeRepository(conn)
    try:
        for item in payload.updates:
            section = repo.type_number_exists("section", item.section_number)
            if section is None:
                raise HTTPException(status_code=404, detail=f"Section {item.section_number} not found")
            # Replace all cross references for this section
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
