import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import ActivityCard from "../components/ActivityCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import { completeActivity, listActivities } from "../services/activityService";
import { getId } from "../utils/formatters";
export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  async function loadActivities() {
    setLoading(true);
    setError("");
    try {
      setActivities(await listActivities(filter ? { type: filter } : {}));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar atividades.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadActivities();
  }, [filter]);
  async function handleComplete(id) {
    setCompletingId(id);
    setError("");
    setResult(null);
    try {
      setResult(await completeActivity(id, { validation_mode: "honor" }));
    } catch (err) {
      setError(
        err.response?.data?.message || "Não foi possível concluir a atividade.",
      );
    } finally {
      setCompletingId("");
    }
  }
  return (
    <div>
      <PageHeader
        eyebrow="Missões"
        title="Atividades"
        description="Treinos, hábitos, sessões e desafios que geram XP."
        action={
          <Link className="primary-button" to="/atividades/nova">
            <Plus size={18} />
            Nova atividade
          </Link>
        }
      />
      <div className="filters">
        {[
          ["", "Todas"],
          ["fitness", "Fitness"],
          ["habit", "Hábitos"],
          ["rpg", "RPG"],
          ["mental", "Mental"],
        ].map(([v, l]) => (
          <button
            key={l}
            className={filter === v ? "active" : ""}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>
      <ErrorMessage message={error} />
      {result && (
        <div className="success-message">
          Atividade concluída. +{result.xpGained || result.xp_gained || 0} XP
          {result.leveledUp && " · Level up!"}
        </div>
      )}
      {loading ? (
        <Loading text="Carregando atividades..." />
      ) : activities.length === 0 ? (
        <EmptyState
          title="Nenhuma atividade encontrada."
          description="Crie sua primeira missão para começar a progressão."
        />
      ) : (
        <section className="cards-grid">
          {activities.map((a) => (
            <ActivityCard
              key={getId(a)}
              activity={a}
              completing={completingId === getId(a)}
              onComplete={handleComplete}
            />
          ))}
        </section>
      )}
    </div>
  );
}
