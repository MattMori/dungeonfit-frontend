import "../../styles/admin.css";

export default function ReportStatusBadge({ status }) {
  return <span className={`report-status-badge ${status}`}>{status}</span>;
}
