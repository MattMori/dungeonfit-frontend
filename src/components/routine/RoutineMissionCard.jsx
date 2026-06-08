import { CheckCircle2 } from "lucide-react";

import "../../styles/retention.css";

export default function RoutineMissionCard({ mission, onComplete, busy }) {
  return (
    <article className="routine-mission-card">
      <div>
        <span className="eyebrow">Missão real</span>
        <h3>{mission.title || mission.nome || "Missão diária"}</h3>
        <p>{mission.description || mission.descricao || "Conclua uma ação real para fortalecer seu personagem."}</p>
      </div>

      <button className="primary-button" type="button" disabled={busy} onClick={() => onComplete(mission._id)}>
        <CheckCircle2 size={18} />
        Concluir
      </button>
    </article>
  );
}
