const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

// POST /diagnostic/submit  -> { sessionId, path }
export function submitDiagnostic(answers) {
  return request('/diagnostic/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}

// GET /path/:sessionId -> { path }
export function getPath(sessionId) {
  return request(`/path/${sessionId}`);
}

// POST /path/:sessionId/node/:nodeId/complete -> { ok }
export function markNodeComplete(sessionId, nodeId, completed) {
  return request(`/path/${sessionId}/node/${nodeId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ completed }),
  });
}
