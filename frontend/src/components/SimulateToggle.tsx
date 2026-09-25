export default function SimulateToggle({
  onComplete,
}: {
  onComplete: (passed: boolean) => void;
}) {
  return (
    <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
      <button onClick={() => onComplete(true)}>Simulate: Pass</button>
      <button onClick={() => onComplete(false)}>Simulate: Fail</button>
    </div>
  );
}
