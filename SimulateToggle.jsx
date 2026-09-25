export default function SimulateToggle({ checked, onToggle, label = 'Mark complete (demo)' }) {
  return (
    <label className="simulate-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
