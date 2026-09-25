const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export type QuizAnswer = { question_id: string; lo_id: string; correct: boolean };
export type MasteryEntry = { lo_id: string; mastery_pct: number };
export type PathNode = {
  node_id: string;
  lo_id: string;
  title: string;
  rationale: string;
  status: "locked" | "current" | "completed" | "remediation";
  order: number;
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export function assess(sessionId: string, answers: QuizAnswer[]) {
  return post<{ session_id: string; mastery_map: MasteryEntry[]; weak_los: string[] }>(
    "/assess",
    { session_id: sessionId, answers }
  );
}

export function generatePath(
  sessionId: string,
  subject: string,
  grade: string,
  targetLo: string,
  masteryMap: MasteryEntry[]
) {
  return post<{ session_id: string; nodes: PathNode[] }>("/generate-path", {
    session_id: sessionId,
    subject,
    grade,
    target_lo: targetLo,
    mastery_map: masteryMap,
  });
}

export function updatePath(sessionId: string, completedNodeId: string, passed: boolean) {
  return post<{ session_id: string; nodes: PathNode[]; message: string }>("/update-path", {
    session_id: sessionId,
    completed_node_id: completedNodeId,
    passed,
  });
}
