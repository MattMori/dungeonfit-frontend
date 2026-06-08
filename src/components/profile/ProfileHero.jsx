import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

import "../../styles/profile.css";

export default function ProfileHero({ bundle, editable = false }) {
  const { profile, character, featured, stats } = bundle || {};
  const title = featured?.title?.name || "Aventureiro do Cronarium";

  return (
    <section className="profile-hero">
      <div className="profile-banner" style={profile?.banner_url ? { backgroundImage: `url(${profile.banner_url})` } : undefined} />

      <div className="profile-hero-content">
        <div className="profile-avatar">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name} />
          ) : (
            <Shield size={42} />
          )}
        </div>

        <div>
          <span className="eyebrow">@{profile?.username}</span>
          <h1>{profile?.display_name || "Aventureiro"}</h1>
          <strong className="profile-title">{title}</strong>
          {profile?.bio && <p>{profile.bio}</p>}

          {character && (
            <div className="profile-class-line">
              {character.raca} · {character.classe} nível {character.nivel}
              {character.subclasse?.nome ? ` · ${character.subclasse.nome}` : ""}
            </div>
          )}

          <div className="profile-quick-stats">
            <span>{stats?.streak?.current_streak || 0} dias</span>
            <span>{stats?.campaigns?.completed || 0} campanhas</span>
            <span>{stats?.combats?.won || 0} vitórias</span>
          </div>

          {editable && (
            <Link className="primary-button" to="/meu-perfil/config">
              Editar perfil
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
