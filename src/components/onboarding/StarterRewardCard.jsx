import { Coins, FlaskConical, Sparkles } from "lucide-react";

import "../../styles/onboarding.css";

export default function StarterRewardCard() {
  return (
    <section className="starter-reward-card">
      <span className="eyebrow">Recompensas iniciais</span>
      <h2>O primeiro ciclo paga bem</h2>

      <div className="starter-reward-grid">
        <article>
          <Sparkles size={20} />
          <strong>50 XP</strong>
        </article>

        <article>
          <Coins size={20} />
          <strong>30 Ecos</strong>
        </article>

        <article>
          <FlaskConical size={20} />
          <strong>Poção de Cura Menor</strong>
        </article>
      </div>
    </section>
  );
}
