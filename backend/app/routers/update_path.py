from fastapi import APIRouter, HTTPException
from app.models.schemas import UpdatePathRequest, UpdatePathResponse, PathNode
from app.services.reranker import rerank
from app.store.memory_store import get_session, update_session

router = APIRouter()


@router.post("/update-path", response_model=UpdatePathResponse)
def update_path(req: UpdatePathRequest):
    session = get_session(req.session_id)
    if "nodes" not in session:
        raise HTTPException(status_code=404, detail="No path found for this session. Call /generate-path first.")

    nodes = [PathNode(**n) for n in session["nodes"]]
    new_nodes, message = rerank(nodes, req.completed_node_id, req.passed)

    update_session(req.session_id, nodes=[n.model_dump() for n in new_nodes])

    return UpdatePathResponse(session_id=req.session_id, nodes=new_nodes, message=message)
