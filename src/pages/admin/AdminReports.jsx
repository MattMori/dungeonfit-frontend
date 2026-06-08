import { useEffect, useState } from "react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminTable from "../../components/admin/AdminTable";
import ReportStatusBadge from "../../components/admin/ReportStatusBadge";

import {
  listAdminReports,
  updateAdminReportStatus,
} from "../../services/adminService";

import "../../styles/admin.css";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    setLoading(true);
    setError("");

    try {
      setReports(await listAdminReports());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar denúncias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function updateStatus(id, status) {
    setBusyId(id);
    setError("");

    try {
      await updateAdminReportStatus(id, {
        status,
        resolution_note: `Status alterado para ${status}.`,
      });
      await loadReports();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar denúncia.");
    } finally {
      setBusyId("");
    }
  }

  const columns = [
    { key: "target_type", label: "Tipo" },
    { key: "reason", label: "Motivo" },
    {
      key: "status",
      label: "Status",
      render: (row) => <ReportStatusBadge status={row.status} />,
    },
    { key: "description", label: "Descrição" },
    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <div className="moderation-actions">
          <button
            className="ghost-button"
            type="button"
            disabled={busyId === row._id}
            onClick={() => updateStatus(row._id, "reviewing")}
          >
            Revisar
          </button>
          <button
            className="ghost-button"
            type="button"
            disabled={busyId === row._id}
            onClick={() => updateStatus(row._id, "resolved")}
          >
            Resolver
          </button>
          <button
            className="ghost-button danger"
            type="button"
            disabled={busyId === row._id}
            onClick={() => updateStatus(row._id, "dismissed")}
          >
            Dispensar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="Denúncias"
        description="Acompanhe denúncias de campanhas, perfis, guildas e crônicas."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando denúncias..." />
      ) : (
        <AdminTable columns={columns} rows={reports} />
      )}
    </div>
  );
}
