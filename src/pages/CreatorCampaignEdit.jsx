import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Archive, BookOpen, Plus, Save, Send, Trash2 } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import {
  archiveCreatorCampaign,
  createCreatorChapter,
  deleteCreatorChapter,
  getCreatorCampaign,
  publishCreatorCampaign,
  updateCreatorCampaign,
} from "../services/creatorService";

import "../styles/creator.css";

export default function CreatorCampaignEdit() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [campaignForm, setCampaignForm] = useState(null);
  const [chapterForm, setChapterForm] = useState({
    title: "",
    scene: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [savingChapter, setSavingChapter] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const campaign = data?.campaign;
  const chapters = data?.chapters || [];

  const canPublish = useMemo(() => chapters.length > 0 && campaign?.status !== "active", [
    chapters,
    campaign,
  ]);

  async function loadCampaign() {
    setLoading(true);
    setError("");

    try {
      const response = await getCreatorCampaign(slug);
      setData(response);
      setCampaignForm({
        title: response.campaign.title || "",
        description: response.campaign.description || "",
        theme: response.campaign.theme || "",
        recommended_level: response.campaign.recommended_level || 1,
        visibility: response.campaign.visibility || "private",
        tags: (response.campaign.tags || []).join(", "),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar campanha.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
  }, [slug]);

  function handleCampaignChange(event) {
    const { name, value } = event.target;
    setCampaignForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleChapterChange(event) {
    const { name, value } = event.target;
    setChapterForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSaveCampaign(event) {
    event.preventDefault();
    setSavingCampaign(true);
    setError("");
    setSuccess("");

    try {
      await updateCreatorCampaign(slug, {
        ...campaignForm,
        recommended_level: Number(campaignForm.recommended_level || 1),
      });
      setSuccess("Campanha atualizada.");
      await loadCampaign();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar campanha.");
    } finally {
      setSavingCampaign(false);
    }
  }

  async function handleCreateChapter(event) {
    event.preventDefault();
    setSavingChapter(true);
    setError("");
    setSuccess("");

    try {
      await createCreatorChapter(slug, chapterForm);
      setChapterForm({ title: "", scene: "" });
      setSuccess("Capítulo criado.");
      await loadCampaign();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar capítulo.");
    } finally {
      setSavingChapter(false);
    }
  }

  async function handleDeleteChapter(id) {
    const confirmed = window.confirm("Excluir este capítulo?");

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteCreatorChapter(id);
      setSuccess("Capítulo excluído.");
      await loadCampaign();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir capítulo.");
    }
  }

  async function handlePublish() {
    setError("");
    setSuccess("");

    try {
      await publishCreatorCampaign(slug, {
        visibility: campaignForm.visibility,
      });

      setSuccess("Campanha publicada.");
      await loadCampaign();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao publicar campanha.");
    }
  }

  async function handleArchive() {
    const confirmed = window.confirm("Arquivar esta campanha?");

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await archiveCreatorCampaign(slug);
      navigate("/minhas-campanhas");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao arquivar campanha.");
    }
  }

  if (loading) {
    return <Loading text="Abrindo editor de campanha..." />;
  }

  if (!campaign || !campaignForm) {
    return (
      <div className="creator-page">
        <ErrorMessage message={error} />
        <EmptyState
          title="Campanha não encontrada."
          description="Não foi possível abrir essa campanha no modo mestre."
        />
      </div>
    );
  }

  return (
    <div className="creator-page">
      <section className="creator-editor-hero">
        <div>
          <span className="eyebrow">Modo Mestre</span>
          <h1>{campaign.title}</h1>
          <p>
            Edite dados da campanha, adicione capítulos e publique quando a
            crônica estiver pronta.
          </p>

          <div className="creator-meta-row">
            <span>{campaign.status}</span>
            <span>{chapters.length} capítulos</span>
            <span>{campaign.visibility}</span>
          </div>
        </div>

        <div className="creator-hero-actions">
          {campaign.status === "active" && (
            <Link className="primary-button" to={`/campanhas/${campaign.slug}`}>
              <BookOpen size={18} />
              Jogar
            </Link>
          )}

          <button
            className="primary-button"
            type="button"
            disabled={!canPublish}
            onClick={handlePublish}
          >
            <Send size={18} />
            Publicar
          </button>

          <button className="ghost-button" type="button" onClick={handleArchive}>
            <Archive size={18} />
            Arquivar
          </button>
        </div>
      </section>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="creator-editor-grid">
        <form className="creator-form" onSubmit={handleSaveCampaign}>
          <h2>Dados da campanha</h2>

          <label>
            Título
            <input name="title" value={campaignForm.title} onChange={handleCampaignChange} />
          </label>

          <label>
            Descrição
            <textarea
              name="description"
              value={campaignForm.description}
              onChange={handleCampaignChange}
            />
          </label>

          <div className="creator-form-grid">
            <label>
              Tema
              <input name="theme" value={campaignForm.theme} onChange={handleCampaignChange} />
            </label>

            <label>
              Nível
              <input
                name="recommended_level"
                type="number"
                min="1"
                value={campaignForm.recommended_level}
                onChange={handleCampaignChange}
              />
            </label>

            <label>
              Visibilidade
              <select
                name="visibility"
                value={campaignForm.visibility}
                onChange={handleCampaignChange}
              >
                <option value="private">Privada</option>
                <option value="public">Pública</option>
              </select>
            </label>
          </div>

          <label>
            Tags
            <input name="tags" value={campaignForm.tags} onChange={handleCampaignChange} />
          </label>

          <button className="primary-button" type="submit" disabled={savingCampaign}>
            <Save size={18} />
            {savingCampaign ? "Salvando..." : "Salvar campanha"}
          </button>
        </form>

        <form className="creator-form" onSubmit={handleCreateChapter}>
          <h2>Novo capítulo</h2>

          <label>
            Título
            <input name="title" value={chapterForm.title} onChange={handleChapterChange} required />
          </label>

          <label>
            Cena narrativa
            <textarea
              name="scene"
              value={chapterForm.scene}
              onChange={handleChapterChange}
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={savingChapter}>
            <Plus size={18} />
            {savingChapter ? "Criando..." : "Adicionar capítulo"}
          </button>
        </form>
      </section>

      <section className="creator-chapters-section">
        <div className="creator-section-heading">
          <span className="eyebrow">Capítulos</span>
          <h2>Estrutura da crônica</h2>
        </div>

        {chapters.length === 0 ? (
          <EmptyState
            title="Nenhum capítulo ainda."
            description="Adicione pelo menos um capítulo antes de publicar a campanha."
          />
        ) : (
          <div className="creator-chapter-list">
            {chapters.map((chapter) => (
              <article className="creator-chapter-card" key={chapter._id}>
                <div>
                  <span className="eyebrow">Capítulo {chapter.order}</span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.scene}</p>

                  <div className="creator-meta-row">
                    <span>{chapter.choices?.length || 0} escolhas</span>
                  </div>
                </div>

                <div className="creator-actions">
                  <Link className="ghost-button" to={`/minhas-campanhas/${slug}/capitulos/${chapter._id}`}>
                    Editar capítulo
                  </Link>

                  <button
                    className="ghost-button danger"
                    type="button"
                    onClick={() => handleDeleteChapter(chapter._id)}
                  >
                    <Trash2 size={18} />
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
