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


app = FastAPI(
    title="Customs Law Platform - RA 10863",
    lifespan=lifespan,
)

origins = (
    ["*"]
    if settings.CORS_ORIGINS.strip() == "*"
    else [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
)

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


app.include_router(chapters_router.router)
app.include_router(search_router.router)
app.include_router(interactive_router.router)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{path:path}")
    async def serve_react(path: str):
        return FileResponse("dist/index.html")
