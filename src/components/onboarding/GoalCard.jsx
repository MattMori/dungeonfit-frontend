import { ArrowRight } from "lucide-react";

import "../../styles/onboarding.css";

export default function GoalCard({ goal, selected, disabled, onSelect }) {
  return (
    <button
      className={`goal-card ${selected ? "selected" : ""}`}
      type="button"
      disabled={disabled}
      onClick={() => onSelect(goal.key)}
    >
      <div>
        <span className="eyebrow">Objetivo</span>
        <h3>{goal.label}</h3>
        <p>{goal.mission_description}</p>
      </div>

      <ArrowRight size={20} />
    </button>
  );
}
