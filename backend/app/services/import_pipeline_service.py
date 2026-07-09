import time
from datetime import datetime

from app.db.database import get_connection
from app.models.enums import ImportMode
from app.models.schemas import (
    ChapterImportPayload,
    ImportDiff,
    ImportResponse,
    PreviewResponse,
)
from app.repositories.backup_repository import BackupRepository
from app.repositories.import_log_repository import ImportLogRepository
from app.repositories.node_repository import NodeRepository
from app.repositories.search_repository import SearchRepository
from app.repositories.settings_repository import SettingsRepository
from app.services.pipeline.backup_manager import BackupManager
from app.services.pipeline.cross_reference_validator import CrossReferenceValidator
from app.services.pipeline.duplicate_checker import DuplicateChecker, DuplicateError
from app.services.pipeline.search_indexer import SearchIndexer
from app.services.pipeline.tree_builder import TreeBuilder
from app.services.pipeline.validator import StructuralValidationError, Validator


class ImportPipelineService:
    def run_preview(self, payload: ChapterImportPayload, mode: ImportMode) -> PreviewResponse:
        conn = get_connection()
        try:
            node_repo = NodeRepository(conn)
            validator = Validator()
            dup_checker = DuplicateChecker(node_repo)
            xref_validator = CrossReferenceValidator(node_repo)

            # Resolve title
            title_id = None
            if payload.title_number:
                title_row = node_repo.type_number_exists("title", payload.title_number)
                if title_row:
                    title_id = title_row["id"]

            warnings = validator.validate_structure(payload)
            dup_checker.check(payload, mode, title_id)
            warnings += xref_validator.validate(payload)

            nodes_to_create = 1  # chapter
            if payload.title_number and title_id is None:
                nodes_to_create += 1  # new title
            for section in payload.sections:
                nodes_to_create += self._count_nodes(section)

            return PreviewResponse(
                valid=True,
                diff=ImportDiff(
                    nodes_to_create=nodes_to_create,
                    nodes_to_update=0,
                    nodes_to_delete=0,
                    warnings=warnings,
                ),
                errors=[],
            )
        except (StructuralValidationError, DuplicateError) as e:
            return PreviewResponse(
                valid=False,
                diff=ImportDiff(nodes_to_create=0, nodes_to_update=0, nodes_to_delete=0),
                errors=[str(e)],
            )
        finally:
            conn.close()

    def _count_nodes(self, section) -> int:
        return 1 + self._count_paragraphs(section.paragraphs)

    def _count_paragraphs(self, paragraphs) -> int:
        count = 0
        for p in paragraphs:
            count += 1 + self._count_paragraphs(p.children)
        return count

    def run_import(
        self, payload: ChapterImportPayload, mode: ImportMode, created_by: str, file_name: str
    ) -> ImportResponse:
        started_at = datetime.utcnow()
        start_perf = time.perf_counter()
        conn = get_connection()
        log_repo = ImportLogRepository(conn)
        log_id = log_repo.create(
            started_at.isoformat(), mode.value, payload.chapter_number,
            payload.title_number, created_by, file_name,
        )
        conn.commit()

        try:
            node_repo = NodeRepository(conn)
            settings_repo = SettingsRepository(conn)
            backup_repo = BackupRepository(conn)
            search_repo = SearchRepository(conn)

            validator = Validator()
            dup_checker = DuplicateChecker(node_repo)
            xref_validator = CrossReferenceValidator(node_repo)
            tree_builder = TreeBuilder(node_repo)
            search_indexer = SearchIndexer(node_repo, search_repo)
            backup_manager = BackupManager(backup_repo)

            # Resolve title (create if needed)
            title_id = None
            if payload.title_number:
                existing_title = node_repo.type_number_exists("title", payload.title_number)
                if existing_title:
                    title_id = existing_title["id"]
                else:
                    title_id = node_repo.insert_node(
                        parent_id=None,
                        node_type="title",
                        node_number=payload.title_number,
                        title=payload.title_title or f"TITLE {payload.title_number}",
                        content=None,
                        depth=0,
                        sort_order=int(payload.title_number) if payload.title_number.isdigit() else 0,
                        created_by=created_by,
                    )

            # Validate using title context
            warnings = validator.validate_structure(payload)
            dup_checker.check(payload, mode, title_id)
            warnings += xref_validator.validate(payload)

            if settings_repo.get("auto_backup") == "true" and mode in (ImportMode.REPLACE, ImportMode.MERGE):
                backup_manager.backup_sqlite_file(reason=f"pre-{mode.value} chapter {payload.chapter_number}")

            # Chapter management
            existing_chapter = node_repo.chapter_exists_under_title(title_id, payload.chapter_number)
            nodes_created = 0
            nodes_updated = 0

            if mode == ImportMode.REPLACE and existing_chapter is not None:
                for node_id in node_repo.get_subtree_ids(existing_chapter["id"]):
                    search_repo.delete_for_nodes([node_id])
                node_repo.delete_node(existing_chapter["id"])
                existing_chapter = None

            if existing_chapter is not None:
                chapter_id = existing_chapter["id"]
            else:
                chapter_id = node_repo.insert_node(
                    parent_id=title_id,
                    node_type="chapter",
                    node_number=payload.chapter_number,
                    title=payload.chapter_title,
                    content=None,
                    depth=1 if title_id else 0,
                    sort_order=int(payload.chapter_number) if payload.chapter_number.isdigit() else 0,
                    created_by=created_by,
                )
                nodes_created += 1

            for i, section in enumerate(payload.sections):
                existing_section = node_repo.type_number_exists("section", section.section_number)
                if mode == ImportMode.MERGE and existing_section is not None:
                    for child_id in node_repo.get_subtree_ids(existing_section["id"]):
                        search_repo.delete_for_nodes([child_id])
                    node_repo.delete_node(existing_section["id"])
                    nodes_updated += 1

                created_count, _ = tree_builder.build_section(chapter_id, section, i, created_by)
                nodes_created += created_count

            index_ms = None
            if settings_repo.get("auto_search_index") == "true":
                index_start = time.perf_counter()
                search_indexer.reindex_subtree(chapter_id)
                if title_id:
                    search_indexer.reindex_subtree(title_id)
                index_ms = int((time.perf_counter() - index_start) * 1000)

            conn.commit()

            duration_ms = int((time.perf_counter() - start_perf) * 1000)
            log_repo.complete(
                log_id, datetime.utcnow().isoformat(), duration_ms,
                len(payload.sections), nodes_created, nodes_updated,
                "success", None, index_ms,
            )
            conn.commit()

            return ImportResponse(
                success=True,
                message=f"Chapter {payload.chapter_number} imported ({mode.value})",
                mode=mode,
                chapter_number=payload.chapter_number,
                sections_imported=len(payload.sections),
                nodes_created=nodes_created,
                nodes_updated=nodes_updated,
                duration_ms=duration_ms,
                warnings=warnings,
            )

        except Exception as e:
            conn.rollback()
            duration_ms = int((time.perf_counter() - start_perf) * 1000)
            try:
                fail_conn = get_connection()
                fail_log_repo = ImportLogRepository(fail_conn)
                fail_log_repo.complete(
                    log_id, datetime.utcnow().isoformat(), duration_ms,
                    0, 0, 0, "failed", str(e), None,
                )
                fail_conn.commit()
                fail_conn.close()
            except Exception:
                pass
            raise
        finally:
            conn.close()
