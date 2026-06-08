import { Link } from "react-router-dom";
import { Bookmark, BookOpen, CheckCircle2, Clock3, Play, Sparkles } from "lucide-react";

import "../../styles/library.css";

function getStatusLabel(campaign) {
  if (campaign.progress?.status === "completed") return "Concluída";
  if (campaign.progress?.pending_real_mission) return "Missão pendente";
  if (campaign.progress?.status === "active") return "Em andamento";
  return "Não iniciada";
}

function getStatusIcon(campaign) {
  if (campaign.progress?.status === "completed") return <CheckCircle2 size={17} />;
  if (campaign.progress?.pending_real_mission) return <Clock3 size={17} />;
  if (campaign.progress?.status === "active") return <Play size={17} />;
  return <BookOpen size={17} />;
}

export default function CampaignLibraryCard({ campaign, onToggleSave }) {
  const isStarted = Boolean(campaign.progress);
  const isCompleted = campaign.progress?.status === "completed";

  return (
    <article className="library-campaign-card">
      <div className="library-card-cover">
        <BookOpen size={34} />
        <span>{campaign.is_official ? "OFICIAL" : "COMUNIDADE"}</span>
      </div>

      <div className="library-card-content">
        <div className="library-card-topline">
          <span className="eyebrow">{campaign.source_label || campaign.theme}</span>

          <button
            className={`save-campaign-button ${campaign.saved ? "saved" : ""}`}
            type="button"
            onClick={() => onToggleSave(campaign)}
            title={campaign.saved ? "Remover dos salvos" : "Salvar para depois"}
          >
            <Bookmark size={18} />
          </button>
        </div>

        <h2>{campaign.title}</h2>

        <p>{campaign.description}</p>

        <div className="library-meta-row">
          <span>{getStatusIcon(campaign)} {getStatusLabel(campaign)}</span>
          <span>{campaign.chapters_count || 0} capítulos</span>
          <span>Nível {campaign.recommended_level || 1}</span>
        </div>

        <div className="library-tags">
          {(campaign.tags || []).slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="library-actions">
          {isStarted ? (
            <Link className="primary-button" to={`/campanhas/${campaign.slug}`}>
              {isCompleted ? "Ver crônica" : "Continuar"}
              <Sparkles size={18} />
            </Link>
          ) : (
            <Link className="primary-button" to={`/campanhas/${campaign.slug}/detalhes`}>
              Ver detalhes
              <Sparkles size={18} />
            </Link>
          )}

          <Link className="ghost-button" to={`/campanhas/${campaign.slug}/detalhes`}>
            Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
