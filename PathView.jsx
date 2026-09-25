import { useEffect, useState } from 'react';
import { getPath } from '../api/client.js';
import { sessionStore, useSessionStore } from '../state/sessionStore.js';
import PathNode from '../components/PathNode.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function PathView() {
  const { sessionId, path, completedNodes } = useSessionStore();
  const [error, setError] = useState('');

  useEffect(() => {
    if (path || !sessionId) return;
    getPath(sessionId)
      .then((data) => sessionStore.setPath(data.path ?? data))
      .catch((err) => setError(err.message || 'Could not load your path.'));
  }, [path, sessionId]);

  if (error) return <p className="form-msg">{error}</p>;
  if (!path) return <p className="section-sub">Loading your path…</p>;

  const percent = path.nodes.length
    ? Math.round((completedNodes.length / path.nodes.length) * 100)
    : 0;

  return (
    <section className="panel">
      <h2>Your learning path</h2>
      <p className="section-sub">{path.title || 'Personalized roadmap'}</p>
      <ProgressBar percent={percent} />
      <p className="progress-label">{percent}% complete</p>
      <div className="node-list">
        {path.nodes.map((node) => (
          <PathNode
            key={node.id}
            node={node}
            completed={completedNodes.includes(node.id)}
          />
        ))}
      </div>
    </section>
  );
}
