from fastapi import APIRouter
from app.models.schemas import AssessRequest, AssessResponse
from app.services.scoring import score_answers, get_weak_los
from app.store.memory_store import update_session

router = APIRouter()


@router.post("/assess", response_model=AssessResponse)
def assess(req: AssessRequest):
    mastery_map = score_answers(req.answers)
    weak_los = get_weak_los(mastery_map)

    update_session(req.session_id, mastery_map=[m.model_dump() for m in mastery_map])

    return AssessResponse(
        session_id=req.session_id,
        mastery_map=mastery_map,
        weak_los=weak_los,
    )
