import { useEffect, useState } from "react";
import { BookOpen, Flame, ScrollText, Sparkles, Trophy } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { getEvolution } from "../services/cronariumService";

import "../styles/cronarium-modules.css";

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        <Icon size={22} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <small>{helper}</small>}
      </div>
    </article>
  );
}

export default function Evolution() {
  const [evolution, setEvolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvolution() {
    setLoading(true);
    setError("");

    try {
      setEvolution(await getEvolution());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar evolução.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvolution();
  }, []);

  if (loading) {
    return <Loading text="Calculando evolução..." />;
  }

  const totals = evolution?.totals;

  return (
    <div>
      <PageHeader
        eyebrow="Evolução"
        title="Evolução da Jornada"
        description="Seu progresso como personagem e como jogador dentro do Cronarium."
      />

      <ErrorMessage message={error} />

      {!totals ? (
        <EmptyState
          title="Sem dados de evolução ainda."
          description="Crie uma ficha, inicie uma campanha e conclua missões reais para gerar progresso."
        />
      ) : (
        <>
          <section className="stats-grid">
            <StatCard
              icon={Sparkles}
              label="XP total"
              value={totals.xp_total || 0}
              helper="Experiência acumulada"
            />
            <StatCard
              icon={BookOpen}
              label="Campanhas"
              value={totals.campaigns_completed || 0}
              helper={`${totals.campaigns_active || 0} em andamento`}
            />
            <StatCard
              icon={Flame}
              label="Missões reais"
              value={totals.real_missions_completed || 0}
              helper="Concluídas"
            />
            <StatCard
              icon={Trophy}
              label="Relíquias"
              value={totals.relics_unlocked || 0}
              helper="Desbloqueadas"
            />
            <StatCard
              icon={ScrollText}
              label="Eventos"
              value={totals.chronicle_events || 0}
              helper="Registros de crônica"
            />
          </section>

          <section className="panel-card">
            <h2>Distribuição de missões</h2>

            {evolution.missionTypes?.length ? (
              <div className="distribution-list">
                {evolution.missionTypes.map((item) => (
                  <article key={item._id || "unknown"}>
                    <strong>{item._id || "Sem tipo"}</strong>
                    <span>{item.count} concluídas · {item.xp || 0} XP</span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-inline">Sem missões reais concluídas ainda.</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
