import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chapters as chapters_router
from app.api import search as search_router
from app.api import interactive as interactive_router
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

if settings.CORS_ORIGINS.strip() == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


# Public routes, always available
app.include_router(chapters_router.router)
app.include_router(search_router.router)
app.include_router(interactive_router.router)

# Dev Panel routes intentionally NOT mounted on this deployed clone.
# The dev_admin / dev_import / dev_links routers still exist in
# app/api/, but are never registered here, so every /api/dev/*
# request 404s regardless of any DEV_PANEL_ENABLED / DEV_ADMIN_KEY setting.

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        if os.path.exists("dist/index.html"):
            return FileResponse("dist/index.html")
        return {"error": "Frontend not found"}
