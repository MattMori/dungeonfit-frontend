import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import JourneyStepCard from "../components/onboarding/JourneyStepCard";
import StarterRewardCard from "../components/onboarding/StarterRewardCard";

import {
  completeFirstJourney,
  completeStarterMission,
  getFirstJourney,
} from "../services/firstJourneyService";

import "../styles/onboarding.css";

export default function FirstJourney() {
  const [data, setData] = useState(null);
  const [busyAction, setBusyAction] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadJourney() {
    setLoading(true);
    setError("");

    try {
      setData(await getFirstJourney());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar Primeira Jornada.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJourney();
  }, []);

  async function handleCompleteMission() {
    setBusyAction("mission");
    setError("");
    setSuccess("");

    try {
      await completeStarterMission();
      setSuccess("Primeira missão concluída. XP, Ecos, item, streak e boss foram atualizados.");
      await loadJourney();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao concluir missão inicial.");
    } finally {
      setBusyAction("");
    }
  }

  async function handleCompleteJourney() {
    setBusyAction("complete");
    setError("");
    setSuccess("");

    try {
      await completeFirstJourney();
      setSuccess("Primeira Jornada concluída. Título recebido: Iniciado do Cronarium.");
      await loadJourney();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao concluir jornada.");
    } finally {
      setBusyAction("");
    }
  }

  if (loading) {
    return <Loading text="Carregando Primeira Jornada..." />;
  }

  if (!data?.onboarding) {
    return (
      <div className="onboarding-page">
        <EmptyState
          title="Primeira Jornada indisponível."
          description="Tente iniciar o onboarding novamente."
        />
      </div>
    );
  }

  const completedSteps = data.onboarding.completed_steps || [];
  const canComplete =
    data.checklist?.every((step) => step.completed) ||
    ["first_mission", "first_campaign", "routine_intro"].every((step) =>
      completedSteps.includes(step),
    );

  return (
    <div className="onboarding-page">
      <section className="first-journey-hero">
        <div>
          <span className="eyebrow">Primeira Jornada</span>
          <h1>O Primeiro Eco</h1>
          <p>
            Uma jornada curta para entender o ciclo: ação real, ficha,
            campanha, recompensa e rotina.
          </p>

          <div className="welcome-actions">
            <Link className="primary-button" to="/personagem">
              Criar/ver ficha
              <ArrowRight size={18} />
            </Link>

            {data.starter_campaign && (
              <Link className="ghost-button" to={`/campanhas/${data.starter_campaign.slug}`}>
                Abrir campanha
              </Link>
            )}
          </div>
        </div>
      </section>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <OnboardingProgress
        steps={[
          "welcome",
          "choose_goal",
          "create_character",
          "first_mission",
          "first_campaign",
          "first_combat",
          "first_reward",
          "routine_intro",
          "done",
        ]}
        completedSteps={completedSteps}
      />

      <section className="first-journey-grid">
        <section className="onboarding-panel">
          <span className="eyebrow">Missão inicial</span>
          <h2>{data.starter_mission?.title}</h2>
          <p>{data.starter_mission?.description}</p>

          <StarterRewardCard />

          <button
            className="primary-button"
            type="button"
            disabled={busyAction === "mission" || completedSteps.includes("first_mission")}
            onClick={handleCompleteMission}
          >
            <CheckCircle2 size={18} />
            {completedSteps.includes("first_mission")
              ? "Missão concluída"
              : busyAction === "mission"
                ? "Concluindo..."
                : "Concluir missão real"}
          </button>
        </section>

        <section className="onboarding-panel">
          <span className="eyebrow">Checklist</span>
          <h2>Começa aqui</h2>

          <div className="journey-step-list">
            {data.checklist?.map((step) => (
              <JourneyStepCard key={step.key} step={step} />
            ))}
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={!canComplete || busyAction === "complete"}
            onClick={handleCompleteJourney}
          >
            {busyAction === "complete" ? "Finalizando..." : "Concluir Primeira Jornada"}
          </button>
        </section>
      </section>
    </div>
  );
}
