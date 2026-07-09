from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.models.schemas import ImportRequest, ImportResponse, PreviewResponse
from app.services.import_pipeline_service import ImportPipelineService
from app.services.pipeline.duplicate_checker import DuplicateError
from app.services.pipeline.validator import StructuralValidationError

router = APIRouter(prefix="/api/dev", tags=["development"])
pipeline = ImportPipelineService()


def _check_enabled():
    if not settings.DEV_PANEL_ENABLED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


@router.post("/preview-chapter", response_model=PreviewResponse)
def preview_chapter(request: ImportRequest) -> PreviewResponse:
    _check_enabled()
    return pipeline.run_preview(request.payload, request.mode)


@router.post("/import-chapter", response_model=ImportResponse)
def import_chapter(request: ImportRequest) -> ImportResponse:
    _check_enabled()
    try:
        return pipeline.run_import(
            request.payload, request.mode, request.created_by or "admin", request.file_name,
        )
    except DuplicateError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except StructuralValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
