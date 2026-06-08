import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, CheckCircle2, MousePointerClick, Swords } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminTable from "../../components/admin/AdminTable";

import { getCreatorCampaignMetrics } from "../../services/adminService";

import "../../styles/admin.css";

export default function CreatorCampaignMetrics() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMetrics() {
    setLoading(true);
    setError("");

    try {
      setData(await getCreatorCampaignMetrics(slug));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar métricas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, [slug]);

  const eventColumns = [
    { key: "_id", label: "Evento" },
    { key: "count", label: "Quantidade" },
    { key: "xp", label: "XP total" },
  ];

  const choiceColumns = [
    { key: "_id", label: "Escolha" },
    { key: "count", label: "Cliques" },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Modo Mestre"
        title="Métricas da campanha"
        description="Entenda onde jogadores entram, vencem, desistem e clicam."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando métricas..." />
      ) : (
        <>
          <section className="admin-metric-grid">
            <AdminMetricCard
              label="Iniciaram"
              value={data?.summary?.started}
              icon={<BookOpen size={24} />}
            />
            <AdminMetricCard
              label="Concluíram"
              value={data?.summary?.completed}
              helper={`${data?.summary?.completion_rate || 0}% conclusão`}
              icon={<CheckCircle2 size={24} />}
            />
            <AdminMetricCard
              label="Combates"
              value={data?.summary?.combats}
              helper={`${data?.summary?.combats_won || 0} vitórias`}
              icon={<Swords size={24} />}
            />
            <AdminMetricCard
              label="Escolhas"
              value={data?.choices?.reduce((sum, item) => sum + item.count, 0) || 0}
              icon={<MousePointerClick size={24} />}
            />
          </section>

          <section className="admin-grid-two">
            <section className="admin-panel">
              <span className="eyebrow">Eventos</span>
              <h2>Crônicas por tipo</h2>
              <AdminTable columns={eventColumns} rows={data?.events_by_type || []} />
            </section>

            <section className="admin-panel">
              <span className="eyebrow">Escolhas</span>
              <h2>Escolhas mais clicadas</h2>
              <AdminTable columns={choiceColumns} rows={data?.choices || []} />
            </section>
          </section>
        </>
      )}
    </div>
  );
}
