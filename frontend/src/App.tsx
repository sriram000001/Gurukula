import { Routes, Route, Navigate } from 'react-router-dom';
import Diagnostic from './pages/Diagnostic.jsx';
import PathView from './pages/PathView.jsx';
import NodeDetail from './pages/NodeDetail.jsx';
import { useSessionStore } from './state/sessionStore.js';

export default function App() {
  const { sessionId } = useSessionStore();

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="dot" />
        <h1>Pathway</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Diagnostic />} />
          <Route
            path="/path"
            element={sessionId ? <PathView /> : <Navigate to="/" replace />}
          />
          <Route
            path="/path/node/:nodeId"
            element={sessionId ? <NodeDetail /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
