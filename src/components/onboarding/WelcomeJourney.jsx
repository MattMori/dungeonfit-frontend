import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "../../styles/onboarding.css";

export default function WelcomeJourney({ onStart, loading }) {
  return (
    <section className="welcome-journey">
      <div>
        <span className="eyebrow">Bem-vindo ao Cronarium</span>
        <h1>Viva uma campanha mesmo sem mesa.</h1>
        <p>
          Crie uma ficha, conclua ações reais, ganhe XP, enfrente encontros e
          transforme rotina em progressão.
        </p>

        <div className="welcome-actions">
          <button className="primary-button" type="button" disabled={loading} onClick={onStart}>
            {loading ? "Abrindo..." : "Começar Primeira Jornada"}
            <ArrowRight size={18} />
          </button>

          <Link className="ghost-button" to="/taverna">
            Ir para a Taverna
          </Link>
        </div>
      </div>
    </section>
  );
}
