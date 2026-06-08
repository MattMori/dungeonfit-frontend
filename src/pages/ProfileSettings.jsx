import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import TitleSelector from "../components/profile/TitleSelector";

import {
  getMyProfile,
  setFeaturedChronicles,
  setFeaturedRelics,
  setProfileTitle,
  updateMyProfile,
} from "../services/profileService";
import { listRelics } from "../services/cronariumService";
import { listChronicles } from "../services/chronicleService";

import "../styles/profile.css";

const INITIAL_FORM = {
  username: "",
  display_name: "",
  bio: "",
  avatar_url: "",
  banner_url: "",
  visibility: "public",
  privacy: {
    show_streak: true,
    show_guild: true,
    show_chronicles: true,
    show_relics: true,
    show_stats: true,
  },
};

export default function ProfileSettings() {
  const [bundle, setBundle] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [relics, setRelics] = useState([]);
  const [chronicles, setChronicles] = useState([]);
  const [selectedRelics, setSelectedRelics] = useState([]);
  const [selectedChronicles, setSelectedChronicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [profileBundle, relicList, chronicleList] = await Promise.all([
        getMyProfile(),
        listRelics().catch(() => []),
        listChronicles().catch(() => []),
      ]);

      setBundle(profileBundle);
      setRelics(relicList || []);
      setChronicles(chronicleList || []);

      const profile = profileBundle.profile;

      setForm({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
        banner_url: profile.banner_url || "",
        visibility: profile.visibility || "public",
        privacy: {
          ...INITIAL_FORM.privacy,
          ...(profile.privacy || {}),
        },
      });

      setSelectedRelics((profile.featured_relic_ids || []).map(String));
      setSelectedChronicles((profile.featured_chronicle_ids || []).map(String));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar configurações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handlePrivacyChange(event) {
    const { name, checked } = event.target;

    setForm((current) => ({
      ...current,
      privacy: {
        ...current.privacy,
        [name]: checked,
      },
    }));
  }

  function toggleRelic(id) {
    setSelectedRelics((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current, id].slice(0, 3);
    });
  }

  function toggleChronicle(id) {
    setSelectedChronicles((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current, id].slice(0, 3);
    });
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving("profile");
    setError("");
    setSuccess("");

    try {
      await updateMyProfile(form);
      setSuccess("Perfil atualizado.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar perfil.");
    } finally {
      setSaving("");
    }
  }

  async function saveFeatured() {
    setSaving("featured");
    setError("");
    setSuccess("");

    try {
      await Promise.all([
        setFeaturedRelics(selectedRelics),
        setFeaturedChronicles(selectedChronicles),
      ]);

      setSuccess("Destaques atualizados.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao salvar destaques.");
    } finally {
      setSaving("");
    }
  }

  async function handleTitle(relicId) {
    setSaving("title");
    setError("");
    setSuccess("");

    try {
      await setProfileTitle(relicId);
      setSuccess("Título atualizado.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao trocar título.");
    } finally {
      setSaving("");
    }
  }

  if (loading) {
    return <Loading text="Abrindo configurações..." />;
  }

  return (
    <div className="profile-page">
      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="profile-settings-hero">
        <div>
          <span className="eyebrow">Perfil</span>
          <h1>Identidade pública</h1>
          <p>Escolha como sua jornada aparece para outros aventureiros.</p>
        </div>

        <Link className="ghost-button" to={`/perfil/${form.username}`}>
          Ver público
        </Link>
      </section>

      <form className="profile-form-panel" onSubmit={saveProfile}>
        <h2>Dados públicos</h2>

        <div className="profile-form-grid">
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} />
          </label>

          <label>
            Nome de exibição
            <input name="display_name" value={form.display_name} onChange={handleChange} />
          </label>

          <label>
            Visibilidade
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </label>

          <label className="profile-form-wide">
            Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} />
          </label>

          <label>
            Avatar URL
            <input name="avatar_url" value={form.avatar_url} onChange={handleChange} />
          </label>

          <label>
            Banner URL
            <input name="banner_url" value={form.banner_url} onChange={handleChange} />
          </label>
        </div>

        <div className="privacy-grid">
          {[
            ["show_streak", "Mostrar streak"],
            ["show_guild", "Mostrar guilda"],
            ["show_chronicles", "Mostrar crônicas"],
            ["show_relics", "Mostrar relíquias"],
            ["show_stats", "Mostrar estatísticas"],
          ].map(([key, label]) => (
            <label key={key}>
              <input
                type="checkbox"
                name={key}
                checked={Boolean(form.privacy[key])}
                onChange={handlePrivacyChange}
              />
              {label}
            </label>
          ))}
        </div>

        <button className="primary-button" type="submit" disabled={saving === "profile"}>
          {saving === "profile" ? "Salvando..." : "Salvar perfil"}
        </button>
      </form>

      <TitleSelector
        relics={relics}
        currentTitleId={bundle?.profile?.equipped_title_id}
        disabled={saving === "title"}
        onSelect={handleTitle}
      />

      <section className="profile-panel">
        <span className="eyebrow">Destaques</span>
        <h2>Relíquias em destaque</h2>

        <div className="selectable-grid">
          {relics.map((relic) => (
            <button
              key={relic._id}
              className={selectedRelics.includes(String(relic._id)) ? "selected" : ""}
              type="button"
              onClick={() => toggleRelic(String(relic._id))}
            >
              {relic.name}
            </button>
          ))}
        </div>
      </section>

      <section className="profile-panel">
        <span className="eyebrow">Destaques</span>
        <h2>Crônicas fixadas</h2>

        <div className="selectable-grid">
          {chronicles.map((event) => (
            <button
              key={event._id}
              className={selectedChronicles.includes(String(event._id)) ? "selected" : ""}
              type="button"
              onClick={() => toggleChronicle(String(event._id))}
            >
              {event.title}
            </button>
          ))}
        </div>

        <button className="primary-button" type="button" disabled={saving === "featured"} onClick={saveFeatured}>
          {saving === "featured" ? "Salvando..." : "Salvar destaques"}
        </button>
      </section>
    </div>
  );
}
