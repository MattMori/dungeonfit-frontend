import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Clock3,
  Play,
  Sparkles,
  UserRound,
} from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { startCampaign } from "../services/campaignService";
import {
  getLibraryCampaign,
  saveLibraryCampaign,
  unsaveLibraryCampaign,
} from "../services/libraryService";

import "../styles/cronarium-experience.css";
import "../styles/library.css";

function getCreatorName(campaign) {
  return (
    campaign?.created_by?.nome ||
    campaign?.created_by?.name ||
    campaign?.created_by?.email ||
    (campaign?.is_official ? "Cronarium" : "Criador desconhecido")
  );
}

export default function CampaignDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCampaign() {
    setLoading(true);
    setError("");

    try {
      setData(await getLibraryCampaign(slug));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar campanha.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
  }, [slug]);

  async function handleStart() {
    setStarting(true);
    setError("");

    try {
      await startCampaign(slug);
      navigate(`/campanhas/${slug}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível iniciar a campanha. Crie uma ficha primeiro.",
      );
    } finally {
      setStarting(false);
    }
  }

  async function handleToggleSave() {
    setSaving(true);
    setError("");

    try {
      if (data.saved) {
        await unsaveLibraryCampaign(slug);
      } else {
        await saveLibraryCampaign(slug);
      }

      await loadCampaign();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar campanha.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading text="Abrindo campanha..." />;
  }

  if (!data?.campaign) {
    return (
      <div>
        <Link className="ghost-button" to="/campanhas">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <ErrorMessage message={error} />

        <EmptyState
          title="Campanha não encontrada."
          description="Essa crônica não está disponível na biblioteca."
        />
      </div>
    );
  }

  const { campaign, progress, relics } = data;
  const isStarted = Boolean(progress);
  const isCompleted = progress?.status === "completed";

  return (
    <div className="campaign-detail-page">
      <Link className="ghost-button" to="/campanhas">
        <ArrowLeft size={18} />
        Voltar para biblioteca
      </Link>

      <ErrorMessage message={error} />

      <section className="campaign-detail-hero">
        <div>
          <span className="eyebrow">
            {campaign.source_label || campaign.theme} · {campaign.is_official ? "Oficial" : "Comunidade"}
          </span>
          <h1>{campaign.title}</h1>
          <p>{campaign.description}</p>

          <div className="campaign-detail-actions">
            {isStarted ? (
              <Link className="primary-button" to={`/campanhas/${campaign.slug}`}>
                {isCompleted ? "Ver crônica" : "Continuar campanha"}
                <ArrowRight size={18} />
              </Link>
            ) : (
              <button className="primary-button" type="button" onClick={handleStart} disabled={starting}>
                <Play size={18} />
                {starting ? "Iniciando..." : "Iniciar campanha"}
              </button>
            )}

            <button className={`ghost-button ${campaign.saved ? "saved-inline" : ""}`} type="button" onClick={handleToggleSave} disabled={saving}>
              <Bookmark size={18} />
              {campaign.saved ? "Remover dos salvos" : "Salvar para depois"}
            </button>
          </div>
        </div>

        <aside className="campaign-detail-tome">
          <BookOpen size={44} />
          <span>CRÔNICA</span>
          <strong>{campaign.chapters_count || 0}</strong>
          <small>capítulos</small>
        </aside>
      </section>

      <section className="detail-info-grid">
        <article>
          <Clock3 size={22} />
          <span>Duração</span>
          <strong>{campaign.chapters_count || 0} capítulos</strong>
        </article>

        <article>
          <Sparkles size={22} />
          <span>Nível recomendado</span>
          <strong>{campaign.recommended_level || 1}</strong>
        </article>

        <article>
          <BookOpen size={22} />
          <span>Status</span>
          <strong>{isCompleted ? "Concluída" : isStarted ? "Em andamento" : "Não iniciada"}</strong>
        </article>

        <article>
          <UserRound size={22} />
          <span>Criador</span>
          <strong>{getCreatorName(campaign)}</strong>
        </article>
      </section>

      <section className="experience-panel">
        <span className="eyebrow">Tags</span>
        <h2>Identidade da campanha</h2>

        <div className="reward-preview-grid">
          {(campaign.tags || []).length ? (
            campaign.tags.map((tag) => <span key={tag}>{tag}</span>)
          ) : (
            <span>sem tags</span>
          )}
        </div>
      </section>

      <section className="experience-panel">
        <span className="eyebrow">Relíquias obtidas</span>
        <h2>{relics?.length || 0} relíquias registradas nessa campanha</h2>
        <p>
          As relíquias são desbloqueadas conforme você conclui missões reais e
          avança capítulos.
        </p>

        {relics?.length > 0 && (
          <div className="reward-preview-grid">
            {relics.map((relic) => (
              <span key={relic._id}>{relic.name}</span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
