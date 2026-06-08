import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { getCreatorCampaign, updateCreatorChapter } from "../services/creatorService";

import "../styles/creator.css";

const DEFAULT_CHOICE = {
  choice_id: "",
  label: "",
  description: "",
  test_attribute: "int",
  test_skill: "",
  difficulty_class: 12,
  success_text: "",
  failure_text: "",
  real_mission: {
    title: "",
    type: "fitness",
    category: "treino-em-casa",
    description: "",
    duration_minutes: 15,
    xp: 50,
  },
  reward: {
    xp: 50,
    item: "",
    title: "",
    rarity: "common",
  },
};

function makeChoiceId(label) {
  return String(label || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CreatorChapterEdit() {
  const { slug, chapterId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [chapterForm, setChapterForm] = useState(null);
  const [choiceDraft, setChoiceDraft] = useState(DEFAULT_CHOICE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const campaign = data?.campaign;
  const chapter = useMemo(
    () => data?.chapters?.find((item) => item._id === chapterId),
    [data, chapterId],
  );

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const response = await getCreatorCampaign(slug);
      setData(response);

      const currentChapter = response.chapters.find((item) => item._id === chapterId);

      if (currentChapter) {
        setChapterForm({
          title: currentChapter.title,
          order: currentChapter.order,
          scene: currentChapter.scene,
          choices: currentChapter.choices || [],
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar capítulo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [slug, chapterId]);

  function handleChapterChange(event) {
    const { name, value } = event.target;

    setChapterForm((current) => ({
      ...current,
      [name]: name === "order" ? Number(value) : value,
    }));
  }

  function handleChoiceChange(event) {
    const { name, value } = event.target;

    setChoiceDraft((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (name === "label" && !current.choice_id) {
        next.choice_id = makeChoiceId(value);
      }

      if (name === "difficulty_class") {
        next.difficulty_class = Number(value || 1);
      }

      return next;
    });
  }

  function handleMissionChange(event) {
    const { name, value } = event.target;

    setChoiceDraft((current) => ({
      ...current,
      real_mission: {
        ...current.real_mission,
        [name]:
          name === "duration_minutes" || name === "xp"
            ? Number(value || 0)
            : value,
      },
    }));
  }

  function handleRewardChange(event) {
    const { name, value } = event.target;

    setChoiceDraft((current) => ({
      ...current,
      reward: {
        ...current.reward,
        [name]: name === "xp" ? Number(value || 0) : value,
      },
    }));
  }

  function handleAddChoice(event) {
    event.preventDefault();

    const choice = {
      ...choiceDraft,
      choice_id: choiceDraft.choice_id || makeChoiceId(choiceDraft.label),
    };

    if (!choice.label || !choice.description || !choice.success_text || !choice.failure_text) {
      setError("Preencha os campos principais da escolha.");
      return;
    }

    if (!choice.real_mission.title || !choice.real_mission.description) {
      setError("Preencha a missão real vinculada à escolha.");
      return;
    }

    setChapterForm((current) => ({
      ...current,
      choices: [...(current.choices || []), choice],
    }));

    setChoiceDraft(DEFAULT_CHOICE);
    setError("");
  }

  function handleRemoveChoice(choiceId) {
    setChapterForm((current) => ({
      ...current,
      choices: current.choices.filter((choice) => choice.choice_id !== choiceId),
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateCreatorChapter(chapterId, chapterForm);
      setSuccess("Capítulo salvo.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar capítulo.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading text="Abrindo editor de capítulo..." />;
  }

  if (!campaign || !chapter || !chapterForm) {
    return (
      <div className="creator-page">
        <ErrorMessage message={error} />
        <EmptyState
          title="Capítulo não encontrado."
          description="Não foi possível abrir este capítulo para edição."
        />
      </div>
    );
  }

  return (
    <div className="creator-page">
      <Link className="ghost-button" to={`/minhas-campanhas/${slug}/editar`}>
        <ArrowLeft size={18} />
        Voltar para campanha
      </Link>

      <section className="creator-editor-hero">
        <div>
          <span className="eyebrow">{campaign.title}</span>
          <h1>{chapter.title}</h1>
          <p>Edite a cena, crie escolhas e defina missões reais para este capítulo.</p>
        </div>
      </section>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <form className="creator-form" onSubmit={handleSave}>
        <h2>Dados do capítulo</h2>

        <div className="creator-form-grid">
          <label>
            Ordem
            <input name="order" type="number" min="1" value={chapterForm.order} onChange={handleChapterChange} />
          </label>

          <label>
            Título
            <input name="title" value={chapterForm.title} onChange={handleChapterChange} />
          </label>
        </div>

        <label>
          Cena narrativa
          <textarea name="scene" value={chapterForm.scene} onChange={handleChapterChange} />
        </label>

        <button className="primary-button" type="submit" disabled={saving}>
          <Save size={18} />
          {saving ? "Salvando..." : "Salvar capítulo"}
        </button>
      </form>

      <section className="creator-editor-grid">
        <form className="creator-form" onSubmit={handleAddChoice}>
          <h2>Nova escolha</h2>

          <label>
            Texto da escolha
            <input name="label" value={choiceDraft.label} onChange={handleChoiceChange} />
          </label>

          <label>
            ID da escolha
            <input name="choice_id" value={choiceDraft.choice_id} onChange={handleChoiceChange} />
          </label>

          <label>
            Descrição
            <textarea name="description" value={choiceDraft.description} onChange={handleChoiceChange} />
          </label>

          <div className="creator-form-grid">
            <label>
              Atributo
              <select name="test_attribute" value={choiceDraft.test_attribute} onChange={handleChoiceChange}>
                <option value="for">Força</option>
                <option value="des">Destreza</option>
                <option value="con">Constituição</option>
                <option value="int">Inteligência</option>
                <option value="sab">Sabedoria</option>
                <option value="car">Carisma</option>
              </select>
            </label>

            <label>
              Perícia
              <input name="test_skill" value={choiceDraft.test_skill} onChange={handleChoiceChange} />
            </label>

            <label>
              CD
              <input name="difficulty_class" type="number" min="1" value={choiceDraft.difficulty_class} onChange={handleChoiceChange} />
            </label>
          </div>

          <label>
            Texto de sucesso
            <textarea name="success_text" value={choiceDraft.success_text} onChange={handleChoiceChange} />
          </label>

          <label>
            Texto de falha
            <textarea name="failure_text" value={choiceDraft.failure_text} onChange={handleChoiceChange} />
          </label>

          <h3>Missão real gerada</h3>

          <label>
            Título
            <input name="title" value={choiceDraft.real_mission.title} onChange={handleMissionChange} />
          </label>

          <label>
            Descrição
            <textarea name="description" value={choiceDraft.real_mission.description} onChange={handleMissionChange} />
          </label>

          <div className="creator-form-grid">
            <label>
              Tipo
              <select name="type" value={choiceDraft.real_mission.type} onChange={handleMissionChange}>
                <option value="fitness">Treino</option>
                <option value="mental">Mental</option>
                <option value="study">Estudo</option>
                <option value="organization">Organização</option>
                <option value="creative">Criativo</option>
                <option value="social">Social</option>
                <option value="rpg">RPG</option>
              </select>
            </label>

            <label>
              Categoria
              <input name="category" value={choiceDraft.real_mission.category} onChange={handleMissionChange} />
            </label>

            <label>
              Minutos
              <input name="duration_minutes" type="number" min="1" value={choiceDraft.real_mission.duration_minutes} onChange={handleMissionChange} />
            </label>
          </div>

          <h3>Recompensa</h3>

          <div className="creator-form-grid">
            <label>
              XP
              <input name="xp" type="number" min="0" value={choiceDraft.reward.xp} onChange={handleRewardChange} />
            </label>

            <label>
              Relíquia
              <input name="item" value={choiceDraft.reward.item} onChange={handleRewardChange} />
            </label>

            <label>
              Raridade
              <select name="rarity" value={choiceDraft.reward.rarity} onChange={handleRewardChange}>
                <option value="common">Comum</option>
                <option value="uncommon">Incomum</option>
                <option value="rare">Rara</option>
                <option value="epic">Épica</option>
                <option value="legendary">Lendária</option>
              </select>
            </label>
          </div>

          <button className="primary-button" type="submit">
            <Plus size={18} />
            Adicionar escolha
          </button>
        </form>

        <section className="creator-choice-list">
          <h2>Escolhas do capítulo</h2>

          {chapterForm.choices?.length ? (
            chapterForm.choices.map((choice) => (
              <article className="creator-choice-card" key={choice.choice_id}>
                <span className="eyebrow">
                  {choice.test_attribute} · CD {choice.difficulty_class}
                </span>

                <h3>{choice.label}</h3>
                <p>{choice.description}</p>

                <div className="creator-meta-row">
                  <span>{choice.real_mission?.title}</span>
                  <span>+{choice.reward?.xp || 0} XP</span>
                  {choice.reward?.item && <span>{choice.reward.item}</span>}
                </div>

                <button className="ghost-button danger" type="button" onClick={() => handleRemoveChoice(choice.choice_id)}>
                  <Trash2 size={18} />
                  Remover
                </button>
              </article>
            ))
          ) : (
            <EmptyState
              title="Nenhuma escolha adicionada."
              description="Crie escolhas para transformar este capítulo em uma experiência jogável."
            />
          )}
        </section>
      </section>
    </div>
  );
}
