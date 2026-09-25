import json
import os
from anthropic import Anthropic
from app.config import ANTHROPIC_API_KEY
from app.models.schemas import MasteryEntry, PathNode

_STANDARDS_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "standards.json")

client = Anthropic(api_key=ANTHROPIC_API_KEY)


def _load_standards() -> dict:
    with open(_STANDARDS_PATH) as f:
        return json.load(f)


def build_path(subject: str, grade: str, target_lo: str, mastery_map: list[MasteryEntry]) -> list[PathNode]:
    standards = _load_standards()
    mastery_lookup = {m.lo_id: m.mastery_pct for m in mastery_map}

    prompt = f"""You are sequencing a personalized learning path for a student.

Standards data (learning objectives with prerequisites):
{json.dumps(standards['learning_objectives'], indent=2)}

Student's current mastery per LO (0-100, missing = not yet assessed):
{json.dumps(mastery_lookup, indent=2)}

Target learning objective: {target_lo}

Rules:
- Order nodes respecting prerequisite chains.
- If mastery for a prerequisite LO is below 60, mark that node status as "remediation" and place it before its dependents.
- The first incomplete node should have status "current"; all following should be "locked".
- Include a short one-sentence "rationale" for each node explaining why it's placed there.

Respond with ONLY a JSON array, no prose, no markdown fences, matching this shape:
[{{"node_id": "n1", "lo_id": "...", "title": "...", "rationale": "...", "status": "current", "order": 1}}]
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw_text = "".join(block.text for block in response.content if block.type == "text")
    cleaned = raw_text.replace("```json", "").replace("```", "").strip()

    try:
        nodes_data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: build a trivial path directly from standards if the LLM output is malformed.
        nodes_data = [
            {
                "node_id": f"n{i+1}",
                "lo_id": lo["lo_id"],
                "title": lo["title"],
                "rationale": "Fallback sequencing (LLM parse failed).",
                "status": "current" if i == 0 else "locked",
                "order": i + 1,
            }
            for i, lo in enumerate(standards["learning_objectives"])
        ]

    return [PathNode(**n) for n in nodes_data]
