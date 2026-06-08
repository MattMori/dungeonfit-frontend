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
      setError(err.response?.data?.message || "Erro ao carregar missões reais.");
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
        err.response?.data?.message || "Não foi possível concluir a missão real.",
      );
    } finally {
      setCompletingId("");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Missões reais"
        title="Missões Reais"
        description="Treinos, foco, estudo, RPG e ações fora da tela que geram XP e movem sua campanha."
        action={
          <Link className="primary-button" to="/atividades/nova">
            <Plus size={18} />
            Nova missão real
          </Link>
        }
      />

      <div className="filters">
        {[
          ["", "Todas"],
          ["fitness", "Treino em casa"],
          ["habit", "Hábitos"],
          ["rpg", "RPG"],
          ["mental", "Mental"],
        ].map(([value, label]) => (
          <button
            key={label}
            className={filter === value ? "active" : ""}
            onClick={() => setFilter(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />

      {result && (
        <div className="success-message">
          Missão real concluída. +{result.xpGained || result.xp_gained || 0} XP
          {result.leveledUp && " · Level up!"}
        </div>
      )}

      {loading ? (
        <Loading text="Carregando missões reais..." />
      ) : activities.length === 0 ? (
        <EmptyState
          title="Nenhuma missão real encontrada."
          description="Crie uma missão manual ou rode o seed com seu userId para começar a progressão."
        />
      ) : (
        <section className="cards-grid">
          {activities.map((activity) => (
            <ActivityCard
              key={getId(activity)}
              activity={activity}
              completing={completingId === getId(activity)}
              onComplete={handleComplete}
            />
          ))}
        </section>
      )}
    </div>
  );
}
