from enum import Enum


class NodeType(str, Enum):
    TITLE = "title"
    CHAPTER = "chapter"
    SECTION = "section"
    PARAGRAPH = "paragraph"
    SUBPARAGRAPH = "subparagraph"
    ITEM = "item"


class ImportMode(str, Enum):
    CREATE = "create"
    REPLACE = "replace"
    MERGE = "merge"


class NodeStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


CHILD_TYPE_SEQUENCE = [NodeType.PARAGRAPH, NodeType.SUBPARAGRAPH, NodeType.ITEM]


def node_type_for_depth(level: int) -> NodeType:
    """level 0 = paragraph, 1 = subparagraph, 2+ = item (nests into itself)."""
    if level < len(CHILD_TYPE_SEQUENCE):
        return CHILD_TYPE_SEQUENCE[level]
    return NodeType.ITEM
