from app.repositories.node_repository import NodeRepository
from app.repositories.search_repository import SearchRepository


class SearchIndexer:
    def __init__(self, node_repo: NodeRepository, search_repo: SearchRepository):
        self.node_repo = node_repo
        self.search_repo = search_repo

    def reindex_subtree(self, root_id: int) -> int:
        node_ids = self.node_repo.get_subtree_ids(root_id)
        self.search_repo.delete_for_nodes(node_ids)
        count = 0
        for node_id in node_ids:
            node = self.node_repo.get_by_id(node_id)
            keywords = ", ".join(self.node_repo.get_keywords(node_id))
            self.search_repo.index_node(
                node_id, node["node_type"], node["node_number"],
                node["title"], node["content"], keywords,
            )
            count += 1
        return count

    def reindex_all(self) -> int:
        self.search_repo.clear_all()
        top_nodes = self.node_repo.get_children(None)
        count = 0
        for node in top_nodes:
            count += self.reindex_subtree(node["id"])
        return count
