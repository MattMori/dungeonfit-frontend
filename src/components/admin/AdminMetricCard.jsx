import "../../styles/admin.css";

export default function AdminMetricCard({ label, value, helper, icon }) {
  return (
    <article className="admin-metric-card">
      <div>
        <span>{label}</span>
        <strong>{value ?? 0}</strong>
        {helper && <small>{helper}</small>}
      </div>

      {icon && <div className="admin-metric-icon">{icon}</div>}
    </article>
  );
}
