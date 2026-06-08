import { useEffect, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import {
  completeRealMissionById,
  createRealMission,
  listRealMissions,
} from "../services/cronariumService";

const DEFAULT_FORM = {
  title: "",
  description: "",
  type: "fitness",
  category: "treino-em-casa",
  xp: 50,
  duration_minutes: 15,
};

export default function RealMissions() {
  const [missions, setMissions] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadMissions() {
    setLoading(true);
    setError("");

    try {
      setMissions(await listRealMissions(filter ? { type: filter } : {}));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar missões reais.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMissions();
  }, [filter]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createRealMission({
        ...form,
        xp: Number(form.xp || 0),
        duration_minutes: Number(form.duration_minutes || 1),
        source: "free",
      });

      setForm(DEFAULT_FORM);
      setShowForm(false);
      setSuccess("Missão real criada.");
      await loadMissions();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar missão real.");
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(id) {
    setCompletingId(id);
    setError("");
    setSuccess("");

    try {
      const response = await completeRealMissionById(id);
      setSuccess(`Missão concluída. +${response.xp_gained || 0} XP`);
      await loadMissions();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao concluir missão real.");
    } finally {
      setCompletingId("");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Missões reais"
        title="Missões Reais"
        description="Treinos, foco, estudo, RPG e ações fora da tela que geram XP e movem sua campanha."
        action={
          <button className="primary-button" type="button" onClick={() => setShowForm((v) => !v)}>
            <Plus size={18} />
            Nova missão real
          </button>
        }
      />

      <div className="filters">
        {[
          ["", "Todas"],
          ["fitness", "Treino em casa"],
          ["habit", "Hábitos"],
          ["rpg", "RPG"],
          ["mental", "Mental"],
          ["study", "Estudo"],
          ["organization", "Organização"],
        ].map(([value, label]) => (
          <button
            key={label}
            className={filter === value ? "active" : ""}
            onClick={() => setFilter(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />

      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form className="panel-card mission-form" onSubmit={handleCreate}>
          <h2>Nova missão real</h2>

          <label>
            Título
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Descrição
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          <div className="form-grid">
            <label>
              Tipo
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="fitness">Treino em casa</option>
                <option value="mental">Mental</option>
                <option value="study">Estudo</option>
                <option value="organization">Organização</option>
                <option value="creative">Criativo</option>
                <option value="social">Social</option>
                <option value="rpg">RPG</option>
                <option value="habit">Hábito</option>
              </select>
            </label>

            <label>
              Categoria
              <input name="category" value={form.category} onChange={handleChange} />
            </label>

            <label>
              XP
              <input name="xp" type="number" min="0" value={form.xp} onChange={handleChange} />
            </label>

            <label>
              Minutos
              <input
                name="duration_minutes"
                type="number"
                min="1"
                value={form.duration_minutes}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Criando..." : "Criar missão"}
          </button>
        </form>
      )}

      {loading ? (
        <Loading text="Carregando missões reais..." />
      ) : missions.length === 0 ? (
        <EmptyState
          title="Nenhuma missão real encontrada."
          description="Crie uma missão livre ou avance em uma campanha para receber missões narrativas."
        />
      ) : (
        <section className="cards-grid">
          {missions.map((mission) => (
            <article className="relic-card" key={mission._id}>
              <div className="relic-icon">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <span className="eyebrow">
                  {mission.source === "campaign" ? "Campanha" : "Livre"} · {mission.type}
                </span>

                <h3>{mission.title}</h3>

                <p>{mission.description}</p>

                <div className="chronicle-event-meta">
                  <span>{mission.status === "completed" ? "Concluída" : "Pendente"}</span>
                  <span>+{mission.xp || 0} XP</span>
                  <span>{mission.duration_minutes || 0} min</span>
                </div>

                {mission.status !== "completed" && (
                  <button
                    className="primary-button"
                    type="button"
                    disabled={completingId === mission._id}
                    onClick={() => handleComplete(mission._id)}
                  >
                    {completingId === mission._id ? "Concluindo..." : "Concluir"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
