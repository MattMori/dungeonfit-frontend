import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { listEnemies } from "../services/enemyService";
import {
  createEncounter,
  deleteEncounter,
  listChapterEncounters,
} from "../services/encounterService";

import "../styles/combat.css";

const INITIAL_FORM = {
  title: "",
  description: "",
  type: "combat",
  difficulty: "normal",
  enemy_id: "",
  quantity: 1,
  rewards_xp: 0,
  relic_name: "",
  relic_rarity: "common",
};

export default function EncounterEditor() {
  const { slug, chapterId } = useParams();

  const [encounters, setEncounters] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedEnemy = useMemo(
    () => enemies.find((enemy) => enemy._id === form.enemy_id),
    [enemies, form.enemy_id],
  );

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [encountersResponse, enemiesResponse] = await Promise.all([
        listChapterEncounters(slug, chapterId),
        listEnemies(),
      ]);

      setEncounters(encountersResponse);
      setEnemies(enemiesResponse);

      if (!form.enemy_id && enemiesResponse[0]?._id) {
        setForm((current) => ({
          ...current,
          enemy_id: enemiesResponse[0]._id,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar encontros.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [slug, chapterId]);

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
      await createEncounter(slug, chapterId, {
        title: form.title,
        description: form.description,
        type: form.type,
        difficulty: form.difficulty,
        enemies: [
          {
            enemy_id: form.enemy_id,
            quantity: Number(form.quantity || 1),
          },
        ],
        rewards: {
          xp: Number(form.rewards_xp || 0),
          relic_name: form.relic_name,
          relic_rarity: form.relic_rarity,
        },
      });

      setForm({
        ...INITIAL_FORM,
        enemy_id: enemies[0]?._id || "",
      });
      setSuccess("Encontro criado.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar encontro.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Excluir este encontro?");
    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteEncounter(id);
      setSuccess("Encontro excluído.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao excluir encontro.");
    }
  }

  if (loading) {
    return <Loading text="Carregando encontros..." />;
  }

  return (
    <div className="combat-page">
      <Link className="ghost-button" to={`/minhas-campanhas/${slug}/editar`}>
        <ArrowLeft size={18} />
        Voltar para campanha
      </Link>

      <section className="combat-hero">
        <div>
          <span className="eyebrow">Modo Mestre</span>
          <h1>Encontros do capítulo</h1>
          <p>Crie combates solo, bosses e desafios vinculados ao capítulo.</p>
        </div>
      </section>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="encounter-editor-grid">
        <form className="encounter-form" onSubmit={handleCreate}>
          <h2>Novo encontro</h2>

          <label>
            Título
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label>
            Descrição
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          <div className="encounter-form-grid">
            <label>
              Tipo
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="combat">Combate</option>
                <option value="boss">Boss</option>
                <option value="skill_challenge">Desafio</option>
              </select>
            </label>

            <label>
              Dificuldade
              <select name="difficulty" value={form.difficulty} onChange={handleChange}>
                <option value="easy">Fácil</option>
                <option value="normal">Normal</option>
                <option value="hard">Difícil</option>
                <option value="deadly">Mortal</option>
              </select>
            </label>
          </div>

          <div className="encounter-form-grid">
            <label>
              Inimigo
              <select name="enemy_id" value={form.enemy_id} onChange={handleChange}>
                {enemies.map((enemy) => (
                  <option key={enemy._id} value={enemy._id}>
                    {enemy.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantidade
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
              />
            </label>
          </div>

          {selectedEnemy && (
            <div className="enemy-preview-box">
              <strong>{selectedEnemy.name}</strong>
              <span>
                CA {selectedEnemy.armor_class} · HP {selectedEnemy.hp} · Dano{" "}
                {selectedEnemy.damage_dice}
              </span>
            </div>
          )}

          <div className="encounter-form-grid">
            <label>
              XP extra
              <input
                name="rewards_xp"
                type="number"
                min="0"
                value={form.rewards_xp}
                onChange={handleChange}
              />
            </label>

            <label>
              Relíquia
              <input name="relic_name" value={form.relic_name} onChange={handleChange} />
            </label>

            <label>
              Raridade
              <select name="relic_rarity" value={form.relic_rarity} onChange={handleChange}>
                <option value="common">Comum</option>
                <option value="uncommon">Incomum</option>
                <option value="rare">Rara</option>
                <option value="epic">Épica</option>
                <option value="legendary">Lendária</option>
              </select>
            </label>
          </div>

          <button className="primary-button" type="submit" disabled={saving}>
            <Plus size={18} />
            {saving ? "Criando..." : "Criar encontro"}
          </button>
        </form>

        <section className="encounter-list-panel">
          <span className="eyebrow">Encontros</span>
          <h2>Combates deste capítulo</h2>

          {encounters.length ? (
            <div className="encounter-list">
              {encounters.map((encounter) => (
                <article key={encounter._id}>
                  <div>
                    <span className="eyebrow">
                      {encounter.type} · {encounter.difficulty}
                    </span>
                    <h3>{encounter.title}</h3>
                    <p>{encounter.description}</p>

                    <div className="combat-meta-row">
                      <span>{encounter.enemies?.length || 0} inimigos</span>
                      <span>+{encounter.rewards?.xp || 0} XP extra</span>
                    </div>
                  </div>

                  <button className="ghost-button danger" type="button" onClick={() => handleDelete(encounter._id)}>
                    <Trash2 size={18} />
                    Excluir
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum encontro ainda."
              description="Crie um combate para dar tensão mecânica à campanha."
            />
          )}
        </section>
      </section>
    </div>
  );
}
