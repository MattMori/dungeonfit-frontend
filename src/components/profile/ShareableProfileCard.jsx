import { Gem, Shield } from "lucide-react";

import "../../styles/profile.css";

export default function ShareableProfileCard({ card }) {
  return (
    <section className="shareable-profile-card">
      <div>
        <span className="eyebrow">Cronarium</span>
        <h1>{card?.display_name || "Aventureiro"}</h1>
        <strong>{card?.title || "Aventureiro do Cronarium"}</strong>
      </div>

      <div className="share-character-seal">
        <Shield size={54} />
      </div>

      {card?.character && (
        <p>
          {card.character.race} · {card.character.class} nível {card.character.level}
          {card.character.subclass ? ` · ${card.character.subclass}` : ""}
        </p>
      )}

      <div className="share-card-stats">
        <span>{card?.stats?.streak || 0} dias</span>
        <span>{card?.stats?.campaigns_completed || 0} campanhas</span>
        <span>{card?.stats?.combats_won || 0} vitórias</span>
        <span>{card?.stats?.chronicles_total || 0} crônicas</span>
      </div>

      <div className="share-card-footer">
        <Gem size={18} />
        @{card?.username}
      </div>
    </section>
  );
}
