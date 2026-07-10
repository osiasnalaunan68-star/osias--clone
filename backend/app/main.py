import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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


# ----- I-import at i-register ang mga routers (may try/except para sa debugging) -----
try:
    from app.api import chapters as chapters_router
    from app.api import search as search_router
    from app.api import interactive as interactive_router
    logger.info("Successfully imported routers")
except Exception as e:
    logger.error(f"Failed to import routers: {e}")
    raise

app.include_router(chapters_router.router)
app.include_router(search_router.router)
app.include_router(interactive_router.router)
logger.info("Routers included")


# ----- I-log ang lahat ng routes para malaman kung anong available -----
@app.on_event("startup")
async def log_routes():
    logger.info("=== Registered routes ===")
    for route in app.routes:
        logger.info(f"  {route.path} - methods: {getattr(route, 'methods', set())}")
    logger.info("==========================")


# ----- Serve static files (dist) and PWA files -----
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

if os.path.exists("dist"):
    DIST_DIR = os.path.abspath("dist")
    # Mount assets folder
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/{path:path}")
    async def serve_react(path: str):
        # 🛡️ Kung ang path ay nagsisimula sa "api/", huwag magbalik ng HTML
        if path.startswith("api/"):
            return JSONResponse(
                status_code=404,
                content={"detail": f"API endpoint not found: /{path}"}
            )

        # Serve real files if they exist (manifest.json, sw.js, icons, etc.)
        candidate = os.path.abspath(os.path.join(DIST_DIR, path))
        if path and candidate.startswith(DIST_DIR) and os.path.isfile(candidate):
            return FileResponse(candidate)

        # Fallback to index.html for SPA routing
        return FileResponse("dist/index.html")
else:
    logger.warning("dist folder not found – frontend build may be missing")
