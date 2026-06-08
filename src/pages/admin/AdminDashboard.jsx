import { useEffect, useState } from "react";
import { BookOpen, Coins, Flag, Shield, Swords, Users } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminMetricCard from "../../components/admin/AdminMetricCard";

import { getAdminDashboard } from "../../services/adminService";

import "../../styles/admin.css";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      setData(await getAdminDashboard());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar painel admin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="Painel Administrativo"
        description="Controle de plataforma, conteúdo, economia e moderação."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando admin..." />
      ) : (
        <>
          <section className="admin-metric-grid">
            <AdminMetricCard
              label="Campanhas ativas"
              value={data?.counters?.campaigns_active}
              helper={`${data?.counters?.campaigns_total || 0} totais`}
              icon={<BookOpen size={24} />}
            />
            <AdminMetricCard
              label="Guildas"
              value={data?.counters?.guilds_total}
              icon={<Users size={24} />}
            />
            <AdminMetricCard
              label="Combates"
              value={data?.counters?.combats_total}
              helper={`${data?.counters?.combats_won || 0} vitórias`}
              icon={<Swords size={24} />}
            />
            <AdminMetricCard
              label="Denúncias abertas"
              value={data?.counters?.reports_open}
              icon={<Flag size={24} />}
            />
            <AdminMetricCard
              label="Ecos em circulação"
              value={data?.economy?.total_balance}
              helper={`${data?.economy?.lifetime_earned || 0} gerados`}
              icon={<Coins size={24} />}
            />
            <AdminMetricCard
              label="Itens ativos"
              value={data?.counters?.shop_items_active}
              helper={`${data?.counters?.inventory_items || 0} itens em inventários`}
              icon={<Shield size={24} />}
            />
          </section>

          <section className="admin-panel">
            <span className="eyebrow">Crônicas recentes</span>
            <h2>Atividade da plataforma</h2>

            <div className="admin-feed-list">
              {(data?.recent_chronicles || []).map((event) => (
                <article key={event._id}>
                  <strong>{event.title}</strong>
                  <span>{event.type} · {event.xp_delta || 0} XP</span>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
