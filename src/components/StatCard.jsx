export default function StatCard({ label, value, hint, icon }) {
  return (
    <article className="stat-card rune-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value ?? "-"}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </article>
  );
}
