from pydantic import BaseModel
from typing import Literal


class QuizAnswer(BaseModel):
    question_id: str
    lo_id: str            # learning objective id this question maps to
    correct: bool


class AssessRequest(BaseModel):
    session_id: str
    answers: list[QuizAnswer]


class MasteryEntry(BaseModel):
    lo_id: str
    mastery_pct: float    # 0-100


class AssessResponse(BaseModel):
    session_id: str
    mastery_map: list[MasteryEntry]
    weak_los: list[str]   # LOs below mastery threshold


class GeneratePathRequest(BaseModel):
    session_id: str
    subject: str
    grade: str
    target_lo: str
    mastery_map: list[MasteryEntry]


class PathNode(BaseModel):
    node_id: str
    lo_id: str
    title: str
    rationale: str         # why this node is here, shown in UI
    status: Literal["locked", "current", "completed", "remediation"]
    order: int


class LearningPath(BaseModel):
    session_id: str
    nodes: list[PathNode]


class UpdatePathRequest(BaseModel):
    session_id: str
    completed_node_id: str
    passed: bool


class UpdatePathResponse(BaseModel):
    session_id: str
    nodes: list[PathNode]
    message: str            # human-readable note e.g. "Added remediation for X"
