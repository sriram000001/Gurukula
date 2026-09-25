import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDiagnostic } from '../api/client.js';
import { sessionStore } from '../state/sessionStore.js';

const QUESTIONS = [
  { id: 'q1', prompt: 'Solve: 3x + 5 = 20', options: ['x = 5', 'x = 15', 'x = 8'] },
  { id: 'q2', prompt: 'Which is a state of matter?', options: ['Plasma', 'Density', 'Velocity'] },
  {
    id: 'q3',
    prompt: 'Pick the correctly punctuated sentence.',
    options: ['Its going to rain, she said.', "It's going to rain, she said."],
  },
];

export default function Diagnostic() {
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const allAnswered = QUESTIONS.every((q) => answers[q.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allAnswered) {
      setError('Answer every question to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await submitDiagnostic(answers);
      sessionStore.setSessionId(result.sessionId);
      sessionStore.setPath(result.path);
      navigate('/path');
    } catch (err) {
      setError(err.message || 'Could not submit the diagnostic.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <h2>Quick diagnostic</h2>
      <p className="section-sub">A few questions to calibrate your learning path.</p>
      <form onSubmit={handleSubmit}>
        {QUESTIONS.map((q) => (
          <fieldset key={q.id} className="question">
            <legend>{q.prompt}</legend>
            {q.options.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => setAnswer(q.id, opt)}
                />
                {opt}
              </label>
            ))}
          </fieldset>
        ))}
        {error && <p className="form-msg">{error}</p>}
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit diagnostic'}
        </button>
      </form>
    </section>
  );
}
