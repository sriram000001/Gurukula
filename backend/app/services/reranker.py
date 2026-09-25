from app.models.schemas import PathNode

_REMEDIATION_TITLES = {
    "LO-8M-02": "Quick review: solving equations with variables on both sides",
    "LO-8M-03": "Quick review: translating word problems into equations",
}


def rerank(nodes: list[PathNode], completed_node_id: str, passed: bool) -> tuple[list[PathNode], str]:
    """
    Rule-based, no LLM call — keeps the adaptive loop fast and reliable for live demos.
    On fail: insert a remediation node directly after the current one, before the next.
    On pass: mark current completed, unlock the next node.
    """
    nodes = sorted(nodes, key=lambda n: n.order)
    message = ""

    for i, node in enumerate(nodes):
        if node.node_id == completed_node_id:
            if passed:
                node.status = "completed"
                if i + 1 < len(nodes):
                    nodes[i + 1].status = "current"
                message = f"Great work — moving on to {nodes[i+1].title if i+1 < len(nodes) else 'the final review'}."
            else:
                node.status = "completed"
                remediation_title = _REMEDIATION_TITLES.get(
                    node.lo_id, f"Remediation: {node.title}"
                )
                remediation = PathNode(
                    node_id=f"remedy-{node.node_id}",
                    lo_id=node.lo_id,
                    title=remediation_title,
                    rationale=f"Inserted because mastery on '{node.title}' wasn't yet solid.",
                    status="current",
                    order=node.order + 0.5,
                )
                nodes.insert(i + 1, remediation)
                for j in range(i + 2, len(nodes)):
                    if nodes[j].status == "current":
                        nodes[j].status = "locked"
                message = f"Added a remediation step before continuing: {remediation_title}"
            break

    # renumber order to keep it clean
    for idx, n in enumerate(sorted(nodes, key=lambda n: n.order)):
        n.order = idx + 1

    return nodes, message
