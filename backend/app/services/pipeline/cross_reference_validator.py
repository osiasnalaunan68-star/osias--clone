from typing import List

from app.models.schemas import ChapterImportPayload
from app.repositories.node_repository import NodeRepository


class CrossReferenceValidator:
    def __init__(self, repo: NodeRepository):
        self.repo = repo

    def validate(self, payload: ChapterImportPayload) -> List[str]:
        warnings: List[str] = []
        in_payload_sections = {s.section_number for s in payload.sections}

        for section in payload.sections:
            for ref in section.cross_references:
                target = self._extract_section_number(ref)
                if target and target not in in_payload_sections:
                    existing = self.repo.type_number_exists("section", target)
                    if existing is None:
                        warnings.append(
                            f"Section {section.section_number} references '{ref}', "
                            f"which does not exist yet (forward reference, non-fatal)"
                        )
        return warnings

    def _extract_section_number(self, ref: str) -> str:
        return "".join(ch for ch in ref if ch.isdigit())
