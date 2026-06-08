import { useEffect, useState } from "react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminTable from "../../components/admin/AdminTable";

import {
  createAdminEnemy,
  listAdminEnemies,
} from "../../services/adminService";

import "../../styles/admin.css";

const INITIAL_FORM = {
  name: "",
  type: "criatura",
  armor_class: 10,
  hp: 10,
  attack_bonus: 2,
  damage_dice: "1d6",
  xp: 25,
  description: "",
  source: "official",
};

export default function AdminEnemies() {
  const [enemies, setEnemies] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadEnemies() {
    setLoading(true);
    setError("");

    try {
      setEnemies(await listAdminEnemies());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar bestiário.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEnemies();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createAdminEnemy({
        ...form,
        armor_class: Number(form.armor_class || 10),
        hp: Number(form.hp || 1),
        attack_bonus: Number(form.attack_bonus || 0),
        xp: Number(form.xp || 0),
      });

      setForm(INITIAL_FORM);
      await loadEnemies();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar inimigo.");
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: "name", label: "Inimigo" },
    { key: "type", label: "Tipo" },
    { key: "armor_class", label: "CA" },
    { key: "hp", label: "HP" },
    { key: "damage_dice", label: "Dano" },
    { key: "xp", label: "XP" },
    { key: "source", label: "Origem" },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="Bestiário"
        description="Gerencie inimigos oficiais e criaturas de combate."
      />

      <ErrorMessage message={error} />

      <section className="admin-form-panel">
        <h2>Novo inimigo</h2>

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Tipo
            <input name="type" value={form.type} onChange={handleChange} />
          </label>

          <label>
            CA
            <input name="armor_class" type="number" value={form.armor_class} onChange={handleChange} />
          </label>

          <label>
            HP
            <input name="hp" type="number" value={form.hp} onChange={handleChange} />
          </label>

          <label>
            Ataque
            <input name="attack_bonus" type="number" value={form.attack_bonus} onChange={handleChange} />
          </label>

          <label>
            Dano
            <input name="damage_dice" value={form.damage_dice} onChange={handleChange} />
          </label>

          <label>
            XP
            <input name="xp" type="number" value={form.xp} onChange={handleChange} />
          </label>

          <label>
            Descrição
            <input name="description" value={form.description} onChange={handleChange} />
          </label>

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Criando..." : "Criar inimigo"}
          </button>
        </form>
      </section>

      {loading ? <Loading text="Carregando bestiário..." /> : <AdminTable columns={columns} rows={enemies} />}
    </div>
  );
}
