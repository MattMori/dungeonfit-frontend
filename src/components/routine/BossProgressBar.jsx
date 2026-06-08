import "../../styles/retention.css";

export default function BossProgressBar({ percent = 0, label = "Progresso" }) {
  const safePercent = Math.min(100, Math.max(0, Number(percent || 0)));

  return (
    <div className="boss-progress-box">
      <div>
        <strong>{label}</strong>
        <span>{safePercent}%</span>
      </div>

      <div className="boss-progress-track">
        <span style={{ width: `${safePercent}%` }} />
      </div>
    </div>
  );
}
