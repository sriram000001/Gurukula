import { useEffect, useState } from "react";
import { generatePath, updatePath, PathNode as PathNodeType } from "../api/client";
import { getSessionId } from "../state/sessionStore";
import PathNode from "../components/PathNode";
import SimulateToggle from "../components/SimulateToggle";

export default function PathView() {
  const [nodes, setNodes] = useState<PathNodeType[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generatePath(getSessionId(), "Mathematics", "8", "LO-8M-03", []).then((res) =>
      setNodes(res.nodes)
    );
  }, []);

  const currentNode = nodes.find((n) => n.status === "current");

  async function handleComplete(passed: boolean) {
    if (!currentNode) return;
    const res = await updatePath(getSessionId(), currentNode.node_id, passed);
    setNodes(res.nodes);
    setMessage(res.message);
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Your Learning Path</h2>
      {nodes.sort((a, b) => a.order - b.order).map((n) => (
        <PathNode key={n.node_id} node={n} />
      ))}
      {currentNode && <SimulateToggle onComplete={handleComplete} />}
      {message && <p style={{ marginTop: 12, fontStyle: "italic" }}>{message}</p>}
    </div>
  );
}
