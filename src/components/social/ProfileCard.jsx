import { Link } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";

import "../../styles/social.css";

export default function ProfileCard({ profile, character, stats }) {
  if (!profile) return null;

  const title = profile.equipped_title_relic_id?.name;

  return (
    <article className="profile-card">
      <div className="profile-avatar">
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.public_name} />
        ) : (
          <span>{profile.public_name?.slice(0, 2)?.toUpperCase() || "CR"}</span>
        )}
      </div>

      <div>
        <span className="eyebrow">@{profile.username}</span>
        <h2>{profile.public_name}</h2>

        {title && (
          <div className="profile-title">
            <Sparkles size={16} />
            {title}
          </div>
        )}

        {profile.bio && <p>{profile.bio}</p>}

        <div className="profile-stat-row">
          <span>
            <strong>{stats?.xp_total ?? character?.experiencia ?? 0}</strong>
            XP
          </span>
          <span>
            <strong>{stats?.campaigns_completed || 0}</strong>
            Campanhas
          </span>
          <span>
            <strong>{stats?.relics_unlocked || 0}</strong>
            Relíquias
          </span>
        </div>

        {character && (
          <div className="profile-character-line">
            <Shield size={16} />
            {character.nome_personagem} · nível {character.nivel || 1}
          </div>
        )}

        <Link className="ghost-button" to={`/perfil/${profile.username}`}>
          Ver perfil público
        </Link>
      </div>
    </article>
  );
}
