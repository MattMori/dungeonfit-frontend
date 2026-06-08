import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Play,
  ScrollText,
  Sparkles,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { listCampaigns, startCampaign } from "../services/campaignService";

import "../styles/campaigns.css";

export default function Campaigns() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingSlug, setStartingSlug] = useState("");
  const [error, setError] = useState("");

  async function loadCampaigns() {
    setLoading(true);
    setError("");

    try {
      setCampaigns(await listCampaigns());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar campanhas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function handleStart(slug) {
    setStartingSlug(slug);
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
      setStartingSlug("");
    }
  }

  if (loading) {
    return <Loading text="Carregando campanhas solo..." />;
  }

  return (
    <div className="campaigns-page">
      <PageHeader
        eyebrow="Campanhas solo"
        title="Viva uma campanha mesmo sem mesa."
        description="Escolha uma história, tome decisões e avance capítulos com missões reais, treinos em casa e ações fora da tela."
      />

      <ErrorMessage message={error} />

      <section className="campaigns-intro-panel">
        <div>
          <span className="eyebrow">Como funciona</span>
          <h2>História, dado e ação real.</h2>
          <p>
            Cada campanha combina narrativa solo, testes da sua ficha e missões
            reais. Você escolhe o caminho, cumpre o ritual fora da tela e
            desbloqueia o próximo capítulo.
          </p>
        </div>

        <div className="campaigns-intro-steps">
          <span>
            <ScrollText size={17} />
            Capítulos
          </span>
          <span>
            <Sparkles size={17} />
            Recompensas
          </span>
          <span>
            <Clock3 size={17} />
            Missões reais
          </span>
        </div>
      </section>

      {campaigns.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha disponível."
          description="Rode o seed de campanhas no backend para liberar a primeira aventura."
        />
      ) : (
        <section className="campaigns-grid">
          {campaigns.map((campaign) => {
            const progress = campaign.progress;
            const isStarted = Boolean(progress);
            const isCompleted = progress?.status === "completed";
            const pendingMission = progress?.pending_real_mission;

            return (
              <article
                className="campaign-card"
                key={campaign._id || campaign.slug}
              >
                <div className="campaign-card-cover">
                  <div className="campaign-card-icon">
                    {isCompleted ? (
                      <CheckCircle2 size={30} />
                    ) : (
                      <ScrollText size={30} />
                    )}
                  </div>

                  <span className="campaign-card-seal">SOLO</span>
                </div>

                <div className="campaign-card-content">
                  <span className="eyebrow">
                    {campaign.theme || "Fantasia"} ·{" "}
                    {campaign.chapters_count || 0} capítulos
                  </span>

                  <h2>{campaign.title}</h2>

                  <p>{campaign.description}</p>

                  <div className="campaign-progress-track">
                    <div
                      style={{
                        width: `${
                          isStarted
                            ? Math.min(
                                100,
                                ((progress?.completed_chapters?.length || 0) /
                                  Math.max(1, campaign.chapters_count || 1)) *
                                  100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <div className="campaign-meta-row">
                    <span>
                      Nível recomendado {campaign.recommended_level || 1}
                    </span>
                    <span>
                      {isCompleted
                        ? "Concluída"
                        : isStarted
                          ? "Em andamento"
                          : "Não iniciada"}
                    </span>
                    {isStarted && !isCompleted && (
                      <span>Capítulo {progress.current_chapter_order}</span>
                    )}
                  </div>

                  {pendingMission && (
                    <div className="campaign-pending-mission">
                      Missão pendente: <strong>{pendingMission.title}</strong>
                    </div>
                  )}

                  <div className="campaign-actions">
                    {isStarted ? (
                      <Link
                        className="primary-button"
                        to={`/campanhas/${campaign.slug}`}
                      >
                        Continuar
                      </Link>
                    ) : (
                      <button
                        className="primary-button"
                        type="button"
                        disabled={startingSlug === campaign.slug}
                        onClick={() => handleStart(campaign.slug)}
                      >
                        <Play size={18} />
                        {startingSlug === campaign.slug
                          ? "Iniciando..."
                          : "Iniciar campanha"}
                      </button>
                    )}

                    <Link
                      className="ghost-button"
                      to={`/campanhas/${campaign.slug}/detalhes`}
                    >
                      <BookOpen size={18} />
                      Detalhes
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
