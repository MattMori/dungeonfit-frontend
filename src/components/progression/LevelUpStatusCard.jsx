import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import ProgressionBar from "./ProgressionBar";

import "../../styles/progression.css";

export default function LevelUpStatusCard({ status, character }) {
  if (!status || !character) return null;

  return (
    <section className={`level-up-status-card ${status.level_up_available ? "available" : ""}`}>
      <div className="level-up-status-icon">
        <Sparkles size={28} />
      </div>

      <div>
        <span className="eyebrow">Progressão</span>

        <h2>
          {status.level_up_available
            ? `Level up disponível: nível ${status.target_level}`
            : `Nível ${status.current_level}`}
        </h2>

        <p>
          {character.nome_personagem} possui {status.xp} XP.
          {status.level_up_available
            ? " Você já pode confirmar a evolução."
            : status.next_level
              ? ` Faltam ${status.xp_remaining} XP para o nível ${status.next_level}.`
              : " Nível máximo atingido."}
        </p>

        <ProgressionBar
          percent={status.progress_percent}
          label={status.next_level ? `Progresso para o nível ${status.next_level}` : "Nível máximo"}
          helper={
            status.next_level_xp
              ? `${status.xp} / ${status.next_level_xp} XP`
              : "A jornada agora é lendária."
          }
        />

        <div className="level-up-status-actions">
          <Link className="primary-button" to="/evolucao/level-up">
            {status.level_up_available ? "Subir de nível" : "Ver progressão"}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
