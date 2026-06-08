import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";
import GoalCard from "../components/onboarding/GoalCard";
import WelcomeJourney from "../components/onboarding/WelcomeJourney";

import {
  chooseOnboardingGoal,
  getOnboardingStatus,
  skipOnboarding,
} from "../services/onboardingService";
import { startFirstJourney } from "../services/firstJourneyService";

import "../styles/onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadOnboarding() {
    setLoading(true);
    setError("");

    try {
      const response = await getOnboardingStatus();
      setData(response);
      setSelectedGoal(response?.state?.user_goal?.primary_goal || "");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar onboarding.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOnboarding();
  }, []);

  async function handleStart() {
    setBusy(true);
    setError("");

    try {
      await startFirstJourney();
      await loadOnboarding();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao iniciar jornada.");
    } finally {
      setBusy(false);
    }
  }

  async function handleChooseGoal(goal) {
    setBusy(true);
    setError("");

    try {
      await chooseOnboardingGoal(goal);
      setSelectedGoal(goal);
      navigate("/primeira-jornada");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao escolher objetivo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSkip() {
    setBusy(true);
    setError("");

    try {
      await skipOnboarding();
      navigate("/taverna");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao pular onboarding.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <Loading text="Abrindo o Cronarium..." />;
  }

  return (
    <div className="onboarding-page">
      <ErrorMessage message={error} />

      <WelcomeJourney onStart={handleStart} loading={busy} />

      <OnboardingProgress
        steps={data?.steps || []}
        completedSteps={data?.state?.completed_steps || []}
      />

      <section className="onboarding-panel">
        <div className="onboarding-panel-heading">
          <div>
            <span className="eyebrow">Objetivo real</span>
            <h2>O que você quer evoluir primeiro?</h2>
            <p>
              Isso define sua missão inicial. Nada de resposta perfeita; escolha
              a dor que mais está pedindo atenção.
            </p>
          </div>

          <button className="ghost-button" type="button" disabled={busy} onClick={handleSkip}>
            Pular
          </button>
        </div>

        <div className="goal-grid">
          {(data?.goals || []).map((goal) => (
            <GoalCard
              key={goal.key}
              goal={goal}
              selected={selectedGoal === goal.key}
              disabled={busy}
              onSelect={handleChooseGoal}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
