import "../../styles/onboarding.css";

export default function OnboardingProgress({ steps = [], completedSteps = [] }) {
  const visibleSteps = steps.filter((step) => step !== "done");
  const completed = visibleSteps.filter((step) => completedSteps.includes(step)).length;
  const percent = visibleSteps.length ? Math.round((completed / visibleSteps.length) * 100) : 0;

  return (
    <section className="onboarding-progress">
      <div>
        <span className="eyebrow">Primeira Jornada</span>
        <h2>{percent}% concluído</h2>
        <p>{completed}/{visibleSteps.length} etapas completas</p>
      </div>

      <div className="onboarding-progress-track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}
