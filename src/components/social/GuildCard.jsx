import { Link } from "react-router-dom";
import { Shield, Users } from "lucide-react";

import "../../styles/social.css";

export default function GuildCard({ guild }) {
  return (
    <article className="guild-card">
      <div className="guild-icon">
        <Shield size={28} />
      </div>

      <div>
        <span className="eyebrow">
          {guild.visibility === "public" ? "Pública" : "Privada"}
          {guild.membership ? ` · ${guild.membership.role}` : ""}
        </span>

        <h2>{guild.name}</h2>
        <p>{guild.description || "Uma guilda do Cronarium."}</p>

        <div className="guild-meta-row">
          <span>
            <Users size={16} />
            {guild.member_count || 0} membros
          </span>
          <span>/{guild.slug}</span>
        </div>

        <Link className="primary-button" to={`/guildas/${guild.slug}`}>
          Abrir guilda
        </Link>
      </div>
    </article>
  );
}
