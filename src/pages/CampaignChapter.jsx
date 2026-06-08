import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Dice5,
  Dumbbell,
  ScrollText,
  Sparkles,
} from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import {
  chooseCampaignOption,
  completeRealMission,
  getCurrentCampaignChapter,
  startCampaign,
} from "../services/campaignService";

import "../styles/campaign-chapter.css";

const ATTR_LABELS = {
  for: "Força",
  des: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  sab: "Sabedoria",
  car: "Carisma",
};

const TYPE_LABELS = {
  fitness: "Treino em casa",
  mental: "Foco mental",
  study: "Estudo",
  organization: "Organização",
  creative: "Criativo",
  social: "Social",
  rpg: "RPG",
};

function getTestLabel(choice) {
  if (choice.test_skill) return choice.test_skill;
  return ATTR_LABELS[choice.test_attribute] || choice.test_attribute || "Teste";
}

export default function CampaignChapter() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [choosingId, setChoosingId] = useState("");
  const [completing, setCompleting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const campaign = data?.campaign;
  const progress = data?.progress;
  const chapter = data?.chapter;

  const pendingMission = progress?.pending_real_mission;
  const isCompleted = progress?.status === "completed";

  const currentChoiceResult = useMemo(() => {
    if (result) return result;
    const last = progress?.choices_made?.[progress.choices_made.length - 1];
    return last || null;
  }, [result, progress]);

  async function loadCurrent() {
    setLoading(true);
    setError("");

    try {
      setData(await getCurrentCampaignChapter(slug));
    } catch (err) {
      if (err.response?.status === 404) {
        setData(null);
      } else {
        setError(err.response?.data?.message || "Erro ao carregar campanha.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrent();
  }, [slug]);

  async function handleStart() {
    setStarting(true);
    setError("");

    try {
      const started = await startCampaign(slug);
      setData(started);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível iniciar a campanha.");
    } finally {
      setStarting(false);
    }
  }

  async function handleChoice(choiceId) {
    setChoosingId(choiceId);
    setError("");

    try {
      const response = await chooseCampaignOption(slug, choiceId);

      setData({
        campaign: response.campaign,
        progress: response.progress,
        chapter: response.chapter,
      });

      setResult(response.result);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível registrar escolha.");
    } finally {
      setChoosingId("");
    }
  }

  async function handleCompleteMission() {
    setCompleting(true);
    setError("");

    try {
      const response = await completeRealMission(slug);
      setResult(null);

      if (response.progress?.status === "completed") {
        await loadCurrent();
      } else {
        setData({
          campaign: response.campaign,
          progress: response.progress,
          chapter: response.nextChapter,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível concluir missão.");
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return <Loading text="Abrindo capítulo..." />;
  }

  if (!data && !campaign) {
    return (
      <div className="campaign-chapter-page">
        <Link className="ghost-button" to="/campanhas">
          <ArrowLeft size={18} />
          Voltar para campanhas
        </Link>

        <ErrorMessage message={error} />

        <section className="chapter-empty-start">
          <ScrollText size={48} />
          <span className="eyebrow">Campanha solo</span>
          <h1>Campanha ainda não iniciada.</h1>
          <p>Crie uma ficha, inicie a campanha e comece o primeiro capítulo.</p>

          <button
            className="primary-button"
            type="button"
            disabled={starting}
            onClick={handleStart}
          >
            {starting ? "Iniciando..." : "Iniciar campanha"}
          </button>
        </section>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="campaign-chapter-page">
        <Link className="ghost-button" to="/campanhas">
          <ArrowLeft size={18} />
          Voltar para campanhas
        </Link>

        <section className="chapter-completed-card">
          <CheckCircle2 size={54} />
          <span className="eyebrow">Campanha concluída</span>
          <h1>{campaign?.title}</h1>
          <p>
            Você concluiu a primeira campanha solo. Sua jornada continua nas próximas crônicas.
          </p>
        </section>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="campaign-chapter-page">
        <Link className="ghost-button" to="/campanhas">
          <ArrowLeft size={18} />
          Voltar para campanhas
        </Link>

        <EmptyState
          title="Capítulo não encontrado."
          description="O progresso existe, mas o capítulo atual não foi encontrado no banco."
        />
      </div>
    );
  }

  return (
    <div className="campaign-chapter-page">
      <Link className="ghost-button" to="/campanhas">
        <ArrowLeft size={18} />
        Voltar para campanhas
      </Link>

      <ErrorMessage message={error} />

      <section className="chapter-hero-card">
        <div className="chapter-hero-rune">☉</div>

        <span className="eyebrow">{campaign?.title}</span>

        <h1>{chapter.title}</h1>

        <p>{chapter.scene}</p>

        <div className="chapter-progress-pill">
          Capítulo {chapter.order} de {campaign?.chapters_count || "?"}
        </div>
      </section>

      {currentChoiceResult && (
        <section className={`chapter-result-card ${currentChoiceResult.success ? "success" : "failure"}`}>
          <div className="result-icon">
            <Dice5 size={26} />
          </div>

          <div>
            <span className="eyebrow">
              {currentChoiceResult.success ? "Teste bem-sucedido" : "Sucesso com consequência"}
            </span>

            <h2>
              d20 {currentChoiceResult.roll || "-"} + bônus{" "}
              {currentChoiceResult.bonus ?? "-"} = {currentChoiceResult.total || "-"}
            </h2>

            <p>{currentChoiceResult.result_text}</p>
          </div>
        </section>
      )}

      {pendingMission ? (
        <section className="real-mission-card">
          <div className="real-mission-icon">
            <Dumbbell size={30} />
          </div>

          <div>
            <span className="eyebrow">
              Missão real · {TYPE_LABELS[pendingMission.type] || pendingMission.type}
            </span>

            <h2>{pendingMission.title}</h2>

            <p>{pendingMission.description}</p>

            <div className="real-mission-meta">
              <span>{pendingMission.duration_minutes} min</span>
              <span>+{pendingMission.xp || 0} XP</span>
              {pendingMission.reward_item && <span>{pendingMission.reward_item}</span>}
            </div>

            <button
              className="primary-button"
              type="button"
              disabled={completing}
              onClick={handleCompleteMission}
            >
              <CheckCircle2 size={18} />
              {completing ? "Concluindo..." : "Concluir missão real"}
            </button>
          </div>
        </section>
      ) : (
        <section className="chapter-choices-grid">
          {chapter.choices.map((choice) => (
            <article className="chapter-choice-card" key={choice.choice_id}>
              <span className="eyebrow">
                Teste: {getTestLabel(choice)} · CD {choice.difficulty_class}
              </span>

              <h3>{choice.label}</h3>

              <p>{choice.description}</p>

              <div className="choice-reward">
                <Sparkles size={16} />
                +{choice.reward?.xp || choice.real_mission?.xp || 0} XP
                {choice.reward?.item ? ` · ${choice.reward.item}` : ""}
              </div>

              <button
                className="primary-button"
                type="button"
                disabled={Boolean(choosingId)}
                onClick={() => handleChoice(choice.choice_id)}
              >
                {choosingId === choice.choice_id ? "Rolando..." : "Escolher caminho"}
              </button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
