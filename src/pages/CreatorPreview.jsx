import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Dice5, Eye, Sparkles } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { getCreatorPreview, previewCreatorChoice } from "../services/creatorService";

import "../styles/creator-pro.css";

export default function CreatorPreview() {
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [chapterOrder, setChapterOrder] = useState(1);
  const [result, setResult] = useState(null);
  const [rollingId, setRollingId] = useState("");
  const [bonus, setBonus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const campaign = data?.campaign;
  const chapters = data?.chapters || [];
  const chapter = data?.chapter;

  async function loadPreview(order = chapterOrder) {
    setLoading(true);
    setError("");

    try {
      setData(await getCreatorPreview(slug, { chapter: order }));
      setResult(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao abrir preview.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPreview(1);
  }, [slug]);

  async function handleChapterChange(order) {
    setChapterOrder(order);
    await loadPreview(order);
  }

  async function handleChoice(choiceId) {
    setRollingId(choiceId);
    setError("");

    try {
      const response = await previewCreatorChoice(slug, {
        chapter_order: chapter.order,
        choice_id: choiceId,
        bonus: Number(bonus || 0),
      });

      setResult(response.result);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao simular escolha.");
    } finally {
      setRollingId("");
    }
  }

  if (loading) {
    return <Loading text="Abrindo preview..." />;
  }

  if (!campaign || !chapter) {
    return (
      <div className="creator-preview-page">
        <Link className="ghost-button" to={`/minhas-campanhas/${slug}/editar`}>
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <ErrorMessage message={error} />

        <EmptyState
          title="Preview indisponível."
          description="Adicione pelo menos um capítulo para testar sua campanha."
        />
      </div>
    );
  }

  return (
    <div className="creator-preview-page">
      <Link className="ghost-button" to={`/minhas-campanhas/${slug}/editar`}>
        <ArrowLeft size={18} />
        Voltar para editor
      </Link>

      <section className="preview-hero">
        <div>
          <span className="eyebrow">Preview do Mestre</span>
          <h1>{campaign.title}</h1>
          <p>
            Este modo simula a campanha sem salvar progresso, XP, crônicas ou
            relíquias.
          </p>
        </div>

        <div className="preview-badge">
          <Eye size={24} />
          Simulação
        </div>
      </section>

      <ErrorMessage message={error} />

      <section className="preview-toolbar">
        <label>
          Capítulo
          <select
            value={chapterOrder}
            onChange={(event) => handleChapterChange(Number(event.target.value))}
          >
            {chapters.map((item) => (
              <option key={item._id} value={item.order}>
                {item.order} · {item.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Bônus simulado
          <input
            type="number"
            value={bonus}
            onChange={(event) => setBonus(event.target.value)}
          />
        </label>
      </section>

      <section className="preview-chapter-card">
        <span className="eyebrow">Capítulo {chapter.order}</span>
        <h2>{chapter.title}</h2>
        <p>{chapter.scene}</p>
      </section>

      {result && (
        <section className={`preview-result-card ${result.success ? "success" : "failure"}`}>
          <Dice5 size={28} />

          <div>
            <span className="eyebrow">
              {result.success ? "Sucesso" : "Falha / consequência"}
            </span>
            <h2>
              d20 {result.roll} + {result.bonus} = {result.total}
            </h2>
            <p>{result.result_text}</p>

            {result.pending_real_mission && (
              <div className="preview-mission">
                <strong>{result.pending_real_mission.title}</strong>
                <span>{result.pending_real_mission.description}</span>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="preview-choice-grid">
        {chapter.choices?.length ? (
          chapter.choices.map((choice) => (
            <article className="preview-choice-card" key={choice.choice_id}>
              <span className="eyebrow">
                {choice.test_attribute} · CD {choice.difficulty_class}
              </span>

              <h3>{choice.label}</h3>
              <p>{choice.description}</p>

              <div className="preview-reward">
                <Sparkles size={16} />
                +{choice.reward?.xp || choice.real_mission?.xp || 0} XP
                {choice.reward?.item ? ` · ${choice.reward.item}` : ""}
              </div>

              <button
                className="primary-button"
                type="button"
                disabled={Boolean(rollingId)}
                onClick={() => handleChoice(choice.choice_id)}
              >
                {rollingId === choice.choice_id ? "Rolando..." : "Simular escolha"}
              </button>
            </article>
          ))
        ) : (
          <EmptyState
            title="Capítulo sem escolhas."
            description="Adicione escolhas no editor para testar este capítulo."
          />
        )}
      </section>
    </div>
  );
}
