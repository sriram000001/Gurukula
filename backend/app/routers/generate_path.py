from fastapi import APIRouter
from app.models.schemas import GeneratePathRequest, LearningPath
from app.services.path_builder import build_path
from app.store.memory_store import update_session

router = APIRouter()


@router.post("/generate-path", response_model=LearningPath)
def generate_path(req: GeneratePathRequest):
    nodes = build_path(
        subject=req.subject,
        grade=req.grade,
        target_lo=req.target_lo,
        mastery_map=req.mastery_map,
    )

    update_session(req.session_id, nodes=[n.model_dump() for n in nodes])

    return LearningPath(session_id=req.session_id, nodes=nodes)
