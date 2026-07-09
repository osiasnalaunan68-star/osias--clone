from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chapters as chapters_router
from app.api import dev_admin as dev_admin_router
from app.api import dev_import as dev_import_router
from app.core.config import settings
from app.db.database import init_db

app = FastAPI(title="Customs Law Platform API - RA 10863")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


app.include_router(chapters_router.router)

if settings.DEV_PANEL_ENABLED:
    app.include_router(dev_import_router.router)
    app.include_router(dev_admin_router.router)

# Import the interactive router and include it unconditionally
from app.api import interactive as interactive_router
app.include_router(interactive_router.router)

from app.api import dev_links as dev_links_router
if settings.DEV_PANEL_ENABLED:
    app.include_router(dev_links_router.router)
