from typing import Dict, List, Optional
from pydantic import BaseModel, Field, field_validator
from app.models.enums import ImportMode, NodeStatus


class CrossReferenceOut(BaseModel):
    text: str
    url: Optional[str] = None


class ParagraphImport(BaseModel):
    number: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)
    keywords: List[str] = []
    notes: Optional[str] = None
    cross_references: List[CrossReferenceOut | str] = []
    children: List["ParagraphImport"] = []

    @field_validator("number", "content")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()


ParagraphImport.model_rebuild()


class SectionImport(BaseModel):
    section_number: str = Field(..., min_length=1)
    section_title: str = Field(..., min_length=1)
    body: Optional[str] = None
    keywords: List[str] = []
    notes: Optional[str] = None
    cross_references: List[CrossReferenceOut | str] = []
    status: NodeStatus = NodeStatus.PUBLISHED
    version: int = 1
    source: Optional[str] = None
    effective_date: Optional[str] = None
    created_by: Optional[str] = None
    paragraphs: List[ParagraphImport] = []

    @field_validator("section_number", "section_title")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()


class ChapterImportPayload(BaseModel):
    title_number: Optional[str] = None
    title_title: Optional[str] = None
    chapter_number: str = Field(..., min_length=1)
    chapter_title: str = Field(..., min_length=1)
    sections: List[SectionImport] = Field(..., min_length=1)

    @field_validator("chapter_number", "chapter_title")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()


class ImportRequest(BaseModel):
    mode: ImportMode = ImportMode.CREATE
    created_by: Optional[str] = "admin"
    file_name: Optional[str] = None
    payload: ChapterImportPayload


class ImportDiff(BaseModel):
    nodes_to_create: int
    nodes_to_update: int
    nodes_to_delete: int
    warnings: List[str] = []


class ImportResponse(BaseModel):
    success: bool
    message: str
    mode: ImportMode
    chapter_number: str
    sections_imported: int
    nodes_created: int
    nodes_updated: int
    duration_ms: int
    warnings: List[str] = []


class PreviewResponse(BaseModel):
    valid: bool
    diff: ImportDiff
    errors: List[str] = []


class NodeOut(BaseModel):
    id: int
    uuid: str
    node_type: str
    node_number: Optional[str]
    title: Optional[str]
    content: Optional[str]
    status: str
    version: int
    keywords: List[str] = []
    cross_references: List[CrossReferenceOut] = []
    notes: List[str] = []
    children: List["NodeOut"] = []


NodeOut.model_rebuild()


class ChapterListItem(BaseModel):
    id: int
    node_number: Optional[str]
    title: Optional[str]
    section_count: int
    created_at: str
    updated_at: str


class ImportLogOut(BaseModel):
    id: int
    uuid: str
    started_at: str
    finished_at: Optional[str]
    duration_ms: Optional[int]
    import_mode: str
    chapter_number: Optional[str]
    sections_imported: int
    nodes_created: int
    nodes_updated: int
    status: str
    error_message: Optional[str]
    search_index_time_ms: Optional[int]
    created_by: Optional[str]
    file_name: Optional[str]


class DatabaseStatus(BaseModel):
    total_nodes: int
    counts_by_type: Dict[str, int]
    database_size_bytes: int
    last_import_at: Optional[str]


class SearchIndexStatus(BaseModel):
    indexed_entries: int
    last_rebuild_at: Optional[str]


class SettingOut(BaseModel):
    key: str
    value: str
    updated_at: str


class SettingsUpdate(BaseModel):
    values: Dict[str, str]


class BulkLinkUpdate(BaseModel):
    updates: List["LinkUpdateItem"]

class LinkUpdateItem(BaseModel):
    section_number: str
    links: List[CrossReferenceOut]
