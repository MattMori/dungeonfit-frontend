import "../../styles/creator-pro.css";

export default function CreatorProgressBadge({ validation, status }) {
  const completion = validation?.completion || 0;
  const hasErrors = (validation?.summary?.errors || 0) > 0;

  let label = "Incompleta";

  if (status === "active") label = "Publicada";
  else if (status === "archived") label = "Arquivada";
  else if (validation?.valid) label = "Pronta";

  return (
    <div className={`creator-progress-badge ${hasErrors ? "has-errors" : ""}`}>
      <div>
        <strong>{label}</strong>
        <span>{completion}% completa</span>
      </div>

      <div className="creator-progress-track">
        <div style={{ width: `${completion}%` }} />
      </div>
    </div>
  );
}
