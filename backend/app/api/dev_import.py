import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import require_dev_access
from app.models.schemas import ImportRequest, ImportResponse, PreviewResponse
from app.services.import_pipeline_service import ImportPipelineService
from app.services.pipeline.duplicate_checker import DuplicateError
from app.services.pipeline.validator import StructuralValidationError

logger = logging.getLogger("customs_law.import")

router = APIRouter(
    prefix="/api/dev",
    tags=["development"],
    dependencies=[Depends(require_dev_access)],
)
pipeline = ImportPipelineService()


@router.post("/preview-chapter", response_model=PreviewResponse)
def preview_chapter(request: ImportRequest) -> PreviewResponse:
    return pipeline.run_preview(request.payload, request.mode)


@router.post("/import-chapter", response_model=ImportResponse)
def import_chapter(request: ImportRequest) -> ImportResponse:
    try:
        return pipeline.run_import(
            request.payload, request.mode, request.created_by or "admin", request.file_name,
        )
    except DuplicateError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except StructuralValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        logger.exception(
            "Unexpected error while importing chapter %s", request.payload.chapter_number
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Import failed unexpectedly. Check the server logs for details.",
        )
