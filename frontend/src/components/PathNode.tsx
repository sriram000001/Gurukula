import { PathNode as PathNodeType } from "../api/client";

const statusColor: Record<string, string> = {
  completed: "#4caf50",
  current: "#2196f3",
  remediation: "#ff9800",
  locked: "#bdbdbd",
};

export default function PathNode({
  node,
  onClick,
}: {
  node: PathNodeType;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${statusColor[node.status]}`,
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 10,
        cursor: onClick ? "pointer" : "default",
        opacity: node.status === "locked" ? 0.5 : 1,
      }}
    >
      <div style={{ fontWeight: 600 }}>{node.title}</div>
      <div style={{ fontSize: 13, color: "#666" }}>{node.rationale}</div>
      <div style={{ fontSize: 11, textTransform: "uppercase", color: statusColor[node.status] }}>
        {node.status}
      </div>
    </div>
  );
}
