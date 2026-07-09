from app.models.enums import ImportMode
from app.models.schemas import ChapterImportPayload
from app.repositories.node_repository import NodeRepository


class DuplicateError(Exception):
    pass


class DuplicateChecker:
    def __init__(self, repo: NodeRepository):
        self.repo = repo

    def check(self, payload: ChapterImportPayload, mode: ImportMode, title_id: int | None = None) -> None:
        # Check chapter uniqueness under the given title
        existing_chapter = self.repo.chapter_exists_under_title(title_id, payload.chapter_number)

        if mode == ImportMode.CREATE and existing_chapter is not None:
            raise DuplicateError(
                f"Chapter {payload.chapter_number} already exists under this Title. Use Replace or Merge mode."
            )
        if mode in (ImportMode.REPLACE, ImportMode.MERGE) and existing_chapter is None:
            raise DuplicateError(
                f"Chapter {payload.chapter_number} does not exist under this Title. Use Create mode."
            )

        if mode == ImportMode.CREATE:
            for section in payload.sections:
                if self.repo.type_number_exists("section", section.section_number) is not None:
                    raise DuplicateError(
                        f"Section {section.section_number} already exists elsewhere in the code"
                    )
