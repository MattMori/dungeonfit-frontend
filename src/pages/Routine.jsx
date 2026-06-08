import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import StreakCard from "../components/routine/StreakCard";
import RoutineMissionCard from "../components/routine/RoutineMissionCard";
import WeeklyBossCard from "../components/routine/WeeklyBossCard";

import {
  completeDailyRoutine,
  getRoutine,
} from "../services/routineService";

import "../styles/retention.css";

export default function Routine() {
  const [data, setData] = useState(null);
  const [busyMissionId, setBusyMissionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadRoutine() {
    setLoading(true);
    setError("");

    try {
      setData(await getRoutine());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar rotina.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoutine();
  }, []);

  async function handleComplete(activityId = null) {
    setBusyMissionId(activityId || "daily");
    setError("");
    setSuccess("");

    try {
      await completeDailyRoutine({
        activity_id: activityId,
        ecos: 30,
        xp: 50,
      });

      setSuccess("Rotina concluída. XP, Ecos, streak e dano no boss foram atualizados.");
      await loadRoutine();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao concluir rotina.");
    } finally {
      setBusyMissionId("");
    }
  }

  if (loading) {
    return <Loading text="Montando sua rotina..." />;
  }

  return (
    <div className="retention-page">
      <PageHeader
        eyebrow="Ritual diário"
        title="Rotina"
        description="Faça uma missão real, mantenha sequência e cause dano no boss semanal."
      />

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="routine-grid">
        <StreakCard streak={data?.streak} />
        <WeeklyBossCard data={data?.boss} />
      </section>

      <section className="retention-panel">
        <span className="eyebrow">Hoje</span>
        <h2>Missões reais</h2>

        {data?.today_missions?.length ? (
          <div className="routine-mission-list">
            {data.today_missions.map((mission) => (
              <RoutineMissionCard
                key={mission._id}
                mission={mission}
                busy={busyMissionId === mission._id}
                onComplete={handleComplete}
              />
            ))}
          </div>
        ) : (
          <RoutineMissionCard
            mission={{
              _id: "daily",
              title: "Missão diária livre",
              description: "Conclua uma ação real útil hoje. Treino, estudo, leitura ou organização contam.",
            }}
            busy={busyMissionId === "daily"}
            onComplete={() => handleComplete(null)}
          />
        )}
      </section>
    </div>
  );
}
