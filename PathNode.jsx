import { Link } from 'react-router-dom';

export default function PathNode({ node, completed }) {
  return (
    <Link
      to={`/path/node/${node.id}`}
      className={`path-node ${completed ? 'is-complete' : ''}`}
    >
      <span className="path-node-status">{completed ? '✓' : node.order}</span>
      <div>
        <strong>{node.title}</strong>
        <p>{node.subject}</p>
      </div>
    </Link>
  );
}
