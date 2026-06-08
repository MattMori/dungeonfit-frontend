import "../../styles/progression.css";

export default function ProgressionBar({ percent = 0, label, helper }) {
  const safePercent = Math.min(100, Math.max(0, Number(percent || 0)));

  return (
    <div className="progression-bar-box">
      <div className="progression-bar-header">
        <strong>{label}</strong>
        <span>{safePercent}%</span>
      </div>

      <div className="progression-bar-track">
        <div style={{ width: `${safePercent}%` }} />
      </div>

      {helper && <small>{helper}</small>}
    </div>
  );
}
