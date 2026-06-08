import { useEffect, useState } from "react";
import { Plus, Shield } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import GuildCard from "../components/social/GuildCard";

import { createGuild, joinGuildByCode, listGuilds } from "../services/guildService";

import "../styles/social.css";

const INITIAL_FORM = {
  name: "",
  slug: "",
  description: "",
  visibility: "private",
};

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function Guilds() {
  const [data, setData] = useState({ myGuilds: [], publicGuilds: [] });
  const [form, setForm] = useState(INITIAL_FORM);
  const [inviteCode, setInviteCode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadGuilds() {
    setLoading(true);
    setError("");

    try {
      setData(await listGuilds());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar guildas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuilds();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => {
      const next = { ...current, [name]: value };

      if (name === "name" && !current.slug) {
        next.slug = slugify(value);
      }

      if (name === "slug") {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createGuild(form);
      setForm(INITIAL_FORM);
      setShowForm(false);
      setSuccess("Guilda criada.");
      await loadGuilds();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar guilda.");
    } finally {
      setSaving(false);
    }
  }

  async function handleJoinByCode(event) {
    event.preventDefault();
    setJoining(true);
    setError("");
    setSuccess("");

    try {
      await joinGuildByCode(inviteCode);
      setInviteCode("");
      setSuccess("Você entrou na guilda.");
      await loadGuilds();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao entrar por código.");
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return <Loading text="Carregando guildas..." />;
  }

  return (
    <div className="social-page">
      <PageHeader
        eyebrow="Guildas"
        title="Guildas"
        description="Jogue solo, mas deixe sua jornada existir dentro de um grupo."
        action={
          <button className="primary-button" type="button" onClick={() => setShowForm((value) => !value)}>
            <Plus size={18} />
            Criar guilda
          </button>
        }
      />

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="social-grid">
        <form className="social-form" onSubmit={handleJoinByCode}>
          <h2>Entrar por código</h2>

          <label>
            Código de convite
            <input
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
              placeholder="AB12CD34"
            />
          </label>

          <button className="primary-button" type="submit" disabled={joining}>
            {joining ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {showForm && (
          <form className="social-form" onSubmit={handleCreate}>
            <h2>Nova guilda</h2>

            <label>
              Nome
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Slug
              <input name="slug" value={form.slug} onChange={handleChange} required />
            </label>

            <label>
              Descrição
              <textarea name="description" value={form.description} onChange={handleChange} />
            </label>

            <label>
              Visibilidade
              <select name="visibility" value={form.visibility} onChange={handleChange}>
                <option value="private">Privada</option>
                <option value="public">Pública</option>
              </select>
            </label>

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Criando..." : "Criar guilda"}
            </button>
          </form>
        )}
      </section>

      <section className="social-section">
        <div className="social-panel-heading">
          <div>
            <span className="eyebrow">Suas guildas</span>
            <h2>Grupos onde você está</h2>
          </div>
          <Shield size={22} />
        </div>

        {data.myGuilds?.length ? (
          <div className="guild-grid">
            {data.myGuilds.map((guild) => (
              <GuildCard guild={guild} key={guild._id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Você ainda não faz parte de nenhuma guilda."
            description="Crie uma guilda ou entre usando um código de convite."
          />
        )}
      </section>

      <section className="social-section">
        <div className="social-panel-heading">
          <div>
            <span className="eyebrow">Guildas públicas</span>
            <h2>Comunidades abertas</h2>
          </div>
          <Shield size={22} />
        </div>

        {data.publicGuilds?.length ? (
          <div className="guild-grid">
            {data.publicGuilds.map((guild) => (
              <GuildCard guild={guild} key={guild._id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma guilda pública ainda."
            description="As primeiras guildas vão aparecer aqui."
          />
        )}
      </section>
    </div>
  );
}
