from typing import List

from app.models.schemas import ChapterImportPayload


class StructuralValidationError(Exception):
    pass


class Validator:
    def validate_structure(self, payload: ChapterImportPayload) -> List[str]:
        warnings: List[str] = []
        seen_sections = set()
        for section in payload.sections:
            if section.section_number in seen_sections:
                raise StructuralValidationError(
                    f"Duplicate section_number '{section.section_number}' within payload"
                )
            seen_sections.add(section.section_number)
            if not section.body and not section.paragraphs:
                raise StructuralValidationError(
                    f"Section {section.section_number} has neither body nor paragraphs"
                )
            self._validate_paragraphs(section.paragraphs, section.section_number, warnings)
        return warnings

    def _validate_paragraphs(self, paragraphs, section_number: str, warnings: List[str], depth: int = 0) -> None:
        seen = set()
        for para in paragraphs:
            if para.number in seen:
                warnings.append(
                    f"Section {section_number}: repeated paragraph label '{para.number}' at depth {depth}"
                )
            seen.add(para.number)
            self._validate_paragraphs(para.children, section_number, warnings, depth + 1)
