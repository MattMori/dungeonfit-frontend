import { useEffect, useState } from "react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminTable from "../../components/admin/AdminTable";
import ModerationActions from "../../components/admin/ModerationActions";

import {
  approveAdminCampaign,
  flagAdminCampaign,
  listAdminCampaigns,
  rejectAdminCampaign,
} from "../../services/adminService";

import "../../styles/admin.css";

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCampaigns() {
    setLoading(true);
    setError("");

    try {
      setCampaigns(await listAdminCampaigns());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar campanhas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function moderate(id, action, note) {
    setBusyId(id);
    setError("");

    try {
      await action(id, note);
      await loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao moderar campanha.");
    } finally {
      setBusyId("");
    }
  }

  const columns = [
    { key: "title", label: "Campanha" },
    { key: "status", label: "Status" },
    { key: "moderation_status", label: "Moderação" },
    {
      key: "creator",
      label: "Criador",
      render: (row) => row.created_by?.nome || row.created_by?.name || row.created_by?.email || "-",
    },
    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <ModerationActions
          disabled={busyId === row._id}
          onApprove={() => moderate(row._id, approveAdminCampaign, "Aprovada pelo admin.")}
          onReject={() => moderate(row._id, rejectAdminCampaign, "Rejeitada pelo admin.")}
          onFlag={() => moderate(row._id, flagAdminCampaign, "Sinalizada pelo admin.")}
        />
      ),
    },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="Campanhas"
        description="Modere campanhas públicas e conteúdo da comunidade."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando campanhas..." />
      ) : (
        <AdminTable columns={columns} rows={campaigns} />
      )}
    </div>
  );
}
