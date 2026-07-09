from typing import Tuple
from app.models.enums import node_type_for_depth
from app.models.schemas import SectionImport, CrossReferenceOut
from app.repositories.node_repository import NodeRepository


class TreeBuilder:
    def __init__(self, repo: NodeRepository):
        self.repo = repo

    def build_section(
        self, chapter_id: int, section: SectionImport, sort_order: int, created_by: str
    ) -> Tuple[int, int]:
        section_id = self.repo.insert_node(
            parent_id=chapter_id,
            node_type="section",
            node_number=section.section_number,
            title=section.section_title,
            content=section.body,
            depth=1,
            sort_order=sort_order,
            status=section.status.value,
            version=section.version,
            source=section.source,
            effective_date=section.effective_date,
            created_by=created_by,
        )
        created = 1
        for kw in section.keywords:
            self.repo.add_keyword(section_id, kw)
        for ref in section.cross_references:
            if isinstance(ref, str):
                self.repo.add_cross_reference(section_id, ref)
            else:
                self.repo.add_cross_reference(section_id, ref.text, ref.url, ref.text)
        if section.notes:
            self.repo.add_note(section_id, section.notes, created_by)

        created += self._build_paragraphs(section_id, section.paragraphs, depth=2, created_by=created_by)
        return created, section_id

    def _build_paragraphs(self, parent_id: int, paragraphs, depth: int, created_by: str) -> int:
        created = 0
        node_type = node_type_for_depth(depth - 2)
        for i, para in enumerate(paragraphs):
            para_id = self.repo.insert_node(
                parent_id=parent_id,
                node_type=node_type.value,
                node_number=para.number,
                title=None,
                content=para.content,
                depth=depth,
                sort_order=i,
                created_by=created_by,
            )
            created += 1
            for kw in para.keywords:
                self.repo.add_keyword(para_id, kw)
            for ref in para.cross_references:
                if isinstance(ref, str):
                    self.repo.add_cross_reference(para_id, ref)
                else:
                    self.repo.add_cross_reference(para_id, ref.text, ref.url, ref.text)
            if para.notes:
                self.repo.add_note(para_id, para.notes, created_by)
            created += self._build_paragraphs(para_id, para.children, depth + 1, created_by)
        return created
