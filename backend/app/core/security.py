from typing import Optional

from fastapi import Header, HTTPException, status

from app.core.config import settings as app_settings
from app.db.database import get_connection


def _db_dev_panel_enabled() -> bool:
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT value FROM settings WHERE key = 'dev_panel_enabled'"
        ).fetchone()
        if row is None:
            return True
        return row["value"] == "true"
    finally:
        conn.close()


def require_dev_access(
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
) -> None:
    """Gate applied to every /api/dev/* route.

    1. DEV_PANEL_ENABLED (.env) must be true - hard switch, needs a restart to flip.
    2. The 'dev_panel_enabled' row in the settings table must be true - soft switch,
       toggled live from the Settings tab in the Dev Panel.
    3. If DEV_ADMIN_KEY is set in .env, the request must send a matching
       X-Admin-Key header.
    """
    if not app_settings.DEV_PANEL_ENABLED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if not _db_dev_panel_enabled():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    if app_settings.DEV_ADMIN_KEY:
        if not x_admin_key or x_admin_key != app_settings.DEV_ADMIN_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid X-Admin-Key header",
            )


def require_edit_access(
    x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key"),
) -> None:
    """Optional gate for endpoints that mutate legal text (outside the Dev Panel).

    Only enforced when DEV_ADMIN_KEY is configured; left open otherwise so the
    solo/local workflow keeps working with zero setup.
    """
    if app_settings.DEV_ADMIN_KEY:
        if not x_admin_key or x_admin_key != app_settings.DEV_ADMIN_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid X-Admin-Key header",
            )
