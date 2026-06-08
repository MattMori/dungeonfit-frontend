import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Dumbbell,
  ScrollText,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import CampaignContinueCard from "../components/CampaignContinueCard";

import { getTavern } from "../services/cronariumService";
import { getBackgroundName, titleCase } from "../utils/characterDisplay";

import "../styles/tavern.css";
import "../styles/cronarium-experience.css";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function Tavern() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTavern() {
    setLoading(true);
    setError("");

    try {
      setData(await getTavern());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar A Taverna.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTavern();
  }, []);

  const character = data?.character;
  const activeCampaign = data?.activeCampaign;
  const campaign = activeCampaign?.campaign;
  const chapter = activeCampaign?.chapter;
  const progress = activeCampaign?.progress;
  const pendingMission =
    progress?.pending_real_mission || data?.pendingMissions?.[0] || null;

  const nextAction = useMemo(() => {
    if (!character) {
      return {
        title: "Crie sua ficha",
        description: "Antes de entrar em uma campanha, você precisa de um personagem.",
        href: "/personagem",
        label: "Criar ficha",
      };
    }

    if (pendingMission) {
      return {
        title: "Conclua sua missão real",
        description: pendingMission.title,
        href: campaign?.slug ? `/campanhas/${campaign.slug}` : "/missoes",
        label: "Ver missão",
      };
    }

    if (campaign?.slug) {
      return {
        title: "Continue a crônica",
        description: chapter?.title || "Sua campanha está esperando sua próxima escolha.",
        href: `/campanhas/${campaign.slug}`,
        label: "Continuar",
      };
    }

    return {
      title: "Escolha uma campanha",
      description: "O Sino dos Esquecidos está disponível para começar.",
      href: "/campanhas",
      label: "Ver campanhas",
    };
  }, [character, pendingMission, campaign, chapter]);

  if (loading) {
    return <Loading text="Abrindo A Taverna..." />;
  }

  return (
    <div className="tavern-page">
      <section className="tavern-hero">
        <div>
          <span className="eyebrow">A Taverna</span>
          <h1>Sua campanha continua.</h1>
          <p>
            Retome sua crônica, acompanhe sua ficha e transforme ações reais em
            progresso de aventura.
          </p>
        </div>

        <div className="tavern-next-action">
          <span className="eyebrow">Próxima ação</span>
          <h2>{nextAction.title}</h2>
          <p>{nextAction.description}</p>

          <Link className="primary-button" to={nextAction.href}>
            {nextAction.label}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <ErrorMessage message={error} />

      <CampaignContinueCard />

      {!character && !campaign ? (
        <EmptyState
          title="A Taverna ainda está silenciosa."
          description="Crie uma ficha e inicie uma campanha para registrar sua primeira crônica."
        />
      ) : (
        <section className="tavern-grid">
          <article className="tavern-panel character-panel">
            <div className="panel-heading-row">
              <div>
                <span className="eyebrow">Ficha</span>
                <h2>{character?.nome_personagem || "Personagem não criado"}</h2>
              </div>

              <div className="panel-icon">
                <Shield size={22} />
              </div>
            </div>

            {character ? (
              <>
                <div className="character-summary-grid">
                  <span>
                    <strong>{titleCase(character.classe)}</strong>
                    Classe
                  </span>
                  <span>
                    <strong>{titleCase(character.raca)}</strong>
                    Raça
                  </span>
                  <span>
                    <strong>{getBackgroundName(character)}</strong>
                    Antecedente
                  </span>
                  <span>
                    <strong>{character.nivel || 1}</strong>
                    Nível
                  </span>
                  <span>
                    <strong>{character.ca || character.classe_armadura || 10}</strong>
                    CA
                  </span>
                  <span>
                    <strong>{character.experiencia || 0}</strong>
                    XP
                  </span>
                </div>

                <Link className="ghost-button" to="/personagem">
                  Abrir ficha
                </Link>
              </>
            ) : (
              <Link className="primary-button" to="/personagem">
                Criar ficha
              </Link>
            )}
          </article>

          <article className="tavern-panel">
            <div className="panel-heading-row">
              <div>
                <span className="eyebrow">Crônica ativa</span>
                <h2>{campaign?.title || "Nenhuma campanha ativa"}</h2>
              </div>

              <div className="panel-icon">
                <BookOpen size={22} />
              </div>
            </div>

            {campaign ? (
              <>
                <p>{chapter?.title || "Capítulo atual não encontrado."}</p>

                <div className="tavern-meta-line">
                  <span>Capítulo {progress?.current_chapter_order || 1}</span>
                  <span>{progress?.status === "completed" ? "Concluída" : "Em andamento"}</span>
                </div>

                <Link className="ghost-button" to={`/campanhas/${campaign.slug}`}>
                  Continuar capítulo
                </Link>
              </>
            ) : (
              <>
                <p>Escolha uma campanha solo para iniciar sua próxima jornada.</p>
                <Link className="ghost-button" to="/campanhas">
                  Ver campanhas
                </Link>
              </>
            )}
          </article>

          <article className="tavern-panel">
            <div className="panel-heading-row">
              <div>
                <span className="eyebrow">Missão real</span>
                <h2>{pendingMission?.title || "Nenhuma missão pendente"}</h2>
              </div>

              <div className="panel-icon">
                <Dumbbell size={22} />
              </div>
            </div>

            {pendingMission ? (
              <>
                <p>{pendingMission.description}</p>

                <div className="tavern-meta-line">
                  <span>{pendingMission.duration_minutes || 0} min</span>
                  <span>+{pendingMission.xp || 0} XP</span>
                </div>

                <Link className="ghost-button" to={campaign?.slug ? `/campanhas/${campaign.slug}` : "/missoes"}>
                  Resolver missão
                </Link>
              </>
            ) : (
              <>
                <p>Crie missões livres ou avance em uma campanha para receber desafios.</p>
                <Link className="ghost-button" to="/missoes">
                  Ver missões reais
                </Link>
              </>
            )}
          </article>

          <article className="tavern-panel">
            <div className="panel-heading-row">
              <div>
                <span className="eyebrow">Relíquias recentes</span>
                <h2>{data?.recentRelics?.length || 0} registradas</h2>
              </div>

              <div className="panel-icon">
                <Sparkles size={22} />
              </div>
            </div>

            {data?.recentRelics?.length ? (
              <div className="mini-list">
                {data.recentRelics.slice(0, 3).map((relic) => (
                  <Link to={`/reliquias/${relic._id}`} key={relic._id}>
                    <strong>{relic.name}</strong>
                    <span>{relic.rarity}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p>Conclua capítulos para desbloquear suas primeiras memórias.</p>
            )}

            <Link className="ghost-button" to="/reliquias">
              Ver relíquias
            </Link>
          </article>

          <article className="tavern-panel tavern-wide">
            <div className="panel-heading-row">
              <div>
                <span className="eyebrow">Últimas crônicas</span>
                <h2>O que aconteceu recentemente</h2>
              </div>

              <div className="panel-icon">
                <ScrollText size={22} />
              </div>
            </div>

            {data?.lastEvents?.length ? (
              <div className="mini-timeline">
                {data.lastEvents.map((event) => (
                  <Link to="/cronicas" key={event._id}>
                    <span>{formatDate(event.createdAt)}</span>
                    <strong>{event.title}</strong>
                    {event.xp_delta > 0 && <em>+{event.xp_delta} XP</em>}
                  </Link>
                ))}
              </div>
            ) : (
              <p>Nenhuma crônica registrada ainda.</p>
            )}
          </article>

          <article className="tavern-panel">
            <div className="panel-heading-row">
              <div>
                <span className="eyebrow">Evolução</span>
                <h2>Progresso da jornada</h2>
              </div>

              <div className="panel-icon">
                <Trophy size={22} />
              </div>
            </div>

            <p>
              Acompanhe XP, campanhas, missões reais, relíquias e eventos da sua
              crônica.
            </p>

            <Link className="ghost-button" to="/evolucao">
              Ver evolução
            </Link>
          </article>
        </section>
      )}
    </div>
  );
}
