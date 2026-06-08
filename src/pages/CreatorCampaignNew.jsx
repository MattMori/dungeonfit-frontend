import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import ErrorMessage from "../components/ErrorMessage";

import { createCreatorCampaign } from "../services/creatorService";

import "../styles/creator.css";

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const INITIAL_FORM = {
  title: "",
  slug: "",
  description: "",
  theme: "fantasia sombria",
  recommended_level: 1,
  visibility: "private",
  tags: "solo, fantasia",
};

export default function CreatorCampaignNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (name === "title" && !current.slug) {
        next.slug = slugify(value);
      }

      if (name === "slug") {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const campaign = await createCreatorCampaign({
        ...form,
        recommended_level: Number(form.recommended_level || 1),
      });

      navigate(`/minhas-campanhas/${campaign.slug}/editar`);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar campanha.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="creator-page">
      <PageHeader
        eyebrow="Modo Mestre"
        title="Criar Campanha"
        description="Comece com a base da sua crônica. Depois você adiciona capítulos, escolhas e missões reais."
      />

      <ErrorMessage message={error} />

      <form className="creator-form" onSubmit={handleSubmit}>
        <label>
          Título
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label>
          Slug
          <input name="slug" value={form.slug} onChange={handleChange} required />
        </label>

        <label>
          Descrição
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <div className="creator-form-grid">
          <label>
            Tema
            <input name="theme" value={form.theme} onChange={handleChange} />
          </label>

          <label>
            Nível recomendado
            <input
              name="recommended_level"
              type="number"
              min="1"
              value={form.recommended_level}
              onChange={handleChange}
            />
          </label>

          <label>
            Visibilidade
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option value="private">Privada</option>
              <option value="public">Pública</option>
            </select>
          </label>
        </div>

        <label>
          Tags
          <input name="tags" value={form.tags} onChange={handleChange} />
        </label>

        <button className="primary-button" type="submit" disabled={saving}>
          {saving ? "Criando..." : "Criar rascunho"}
        </button>
      </form>
    </div>
  );
}
