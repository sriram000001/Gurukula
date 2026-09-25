import { useParams, Link } from 'react-router-dom';
import { markNodeComplete } from '../api/client.js';
import { sessionStore, useSessionStore } from '../state/sessionStore.js';
import SimulateToggle from '../components/SimulateToggle.jsx';

export default function NodeDetail() {
  const { nodeId } = useParams();
  const { sessionId, path, completedNodes } = useSessionStore();
  const node = path?.nodes.find((n) => n.id === nodeId);
  const completed = completedNodes.includes(nodeId);

  async function handleToggle(next) {
    sessionStore.markNodeComplete(nodeId, next);
    try {
      await markNodeComplete(sessionId, nodeId, next);
    } catch {
      // demo-only toggle: roll back local state if the API call fails
      sessionStore.markNodeComplete(nodeId, !next);
    }
  }

  if (!node) return <p className="section-sub">Node not found.</p>;

  return (
    <section className="panel">
      <Link to="/path" className="back-link">← Back to path</Link>
      <h2>{node.title}</h2>
      <p className="section-sub">{node.subject}</p>
      <p>{node.rationale || 'Recommended because it matches your diagnostic results.'}</p>
      <div className="resource-stub">
        <strong>Resource</strong>
        <p>{node.resource || 'Linked lesson content goes here.'}</p>
      </div>
      <SimulateToggle checked={completed} onToggle={handleToggle} />
    </section>
  );
}
