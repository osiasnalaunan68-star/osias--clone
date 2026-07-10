import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

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

# CORS
origins = ["*"] if settings.CORS_ORIGINS.strip() == "*" else [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
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

# ---------- Import routers with detailed logging ----------
try:
    from app.api import chapters as chapters_router
    logger.info("✅ chapters router imported successfully")
except Exception as e:
    logger.error(f"❌ Failed to import chapters: {e}")
    raise

try:
    from app.api import search as search_router
    logger.info("✅ search router imported successfully")
except Exception as e:
    logger.error(f"❌ Failed to import search: {e}")
    raise

try:
    from app.api import interactive as interactive_router
    logger.info("✅ interactive router imported successfully")
except Exception as e:
    logger.error(f"❌ Failed to import interactive: {e}")
    raise

app.include_router(chapters_router.router)
app.include_router(search_router.router)
app.include_router(interactive_router.router)
logger.info("✅ All routers included")

# ---------- Log all routes at startup ----------
@app.on_event("startup")
async def log_routes():
    logger.info("=== REGISTERED ROUTES ===")
    for route in app.routes:
        methods = getattr(route, "methods", set())
        logger.info(f"  {route.path} - {methods}")
    logger.info("==========================")

# ---------- Serve static files (dist) ----------
if os.path.exists("dist"):
    DIST_DIR = os.path.abspath("dist")
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    logger.info(f"✅ Static assets mounted from {DIST_DIR}/assets")
else:
    logger.warning("⚠️ dist folder not found – frontend build missing")

# ---------- Catch-all for SPA (must be LAST) ----------
@app.get("/{path:path}")
async def serve_react(path: str):
    # If path starts with api/, return a JSON 404 (not HTML)
    if path.startswith("api/"):
        return JSONResponse(
            status_code=404,
            content={"detail": f"API endpoint not found: /{path}"}
        )
    # Serve real files if they exist (manifest.json, sw.js, icons, etc.)
    candidate = os.path.abspath(os.path.join(DIST_DIR, path))
    if path and candidate.startswith(DIST_DIR) and os.path.isfile(candidate):
        return FileResponse(candidate)
    # Fallback to index.html for SPA routes
    return FileResponse("dist/index.html")
