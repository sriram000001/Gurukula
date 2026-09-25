import { useState } from "react";
import { assess, QuizAnswer } from "../api/client";
import { getSessionId } from "../state/sessionStore";

// Hardcoded for demo speed — swap for a fetch from quiz_bank.json via a backend endpoint if time allows.
const QUESTIONS = [
  { question_id: "Q1", lo_id: "LO-8M-01", text: "Which is a rational number?", options: ["-3", "sqrt(2)", "pi"] },
  { question_id: "Q2", lo_id: "LO-8M-02", text: "Solve: 3x + 5 = 2x + 12", options: ["x = 7", "x = 5", "x = 17"] },
];
const CORRECT: Record<string, string> = { Q1: "-3", Q2: "x = 7" };

export default function Diagnostic({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  async function submit() {
    const answers: QuizAnswer[] = QUESTIONS.map((q) => ({
      question_id: q.question_id,
      lo_id: q.lo_id,
      correct: selected[q.question_id] === CORRECT[q.question_id],
    }));
    await assess(getSessionId(), answers);
    onDone();
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Quick Diagnostic</h2>
      {QUESTIONS.map((q) => (
        <div key={q.question_id} style={{ marginBottom: 16 }}>
          <p>{q.text}</p>
          {q.options.map((opt) => (
            <label key={opt} style={{ display: "block" }}>
              <input
                type="radio"
                name={q.question_id}
                checked={selected[q.question_id] === opt}
                onChange={() => setSelected((s) => ({ ...s, [q.question_id]: opt }))}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit}>See My Path</button>
    </div>
  );
}
