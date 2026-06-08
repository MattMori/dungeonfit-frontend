import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import "../../styles/onboarding.css";

export default function JourneyStepCard({ step }) {
  return (
    <article className={`journey-step-card ${step.completed ? "completed" : ""}`}>
      <div className="journey-step-icon">
        {step.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </div>

      <div>
        <h3>{step.title}</h3>
        <p>{step.description}</p>

        {step.action_url && !step.completed && (
          <Link className="ghost-button" to={step.action_url}>
            Continuar
            <ExternalLink size={16} />
          </Link>
        )}
      </div>
    </article>
  );
}
