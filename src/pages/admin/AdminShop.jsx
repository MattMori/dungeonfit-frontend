import { useEffect, useState } from "react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminTable from "../../components/admin/AdminTable";

import {
  createAdminShopItem,
  listAdminShopItems,
  updateAdminShopItem,
} from "../../services/adminService";

import "../../styles/admin.css";

const INITIAL_FORM = {
  name: "",
  type: "consumable",
  slot: "none",
  price: 50,
  rarity: "common",
  description: "",
  effect: "{}",
  active: true,
};

export default function AdminShop() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      setItems(await listAdminShopItems());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar loja admin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createAdminShopItem({
        ...form,
        price: Number(form.price || 0),
        effect: JSON.parse(form.effect || "{}"),
      });

      setForm(INITIAL_FORM);
      await loadItems();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar item. Verifique o JSON de efeito.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item) {
    setError("");

    try {
      await updateAdminShopItem(item._id, { active: !item.active });
      await loadItems();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar item.");
    }
  }

  const columns = [
    { key: "name", label: "Item" },
    { key: "type", label: "Tipo" },
    { key: "rarity", label: "Raridade" },
    { key: "price", label: "Preço" },
    {
      key: "active",
      label: "Ativo",
      render: (row) => (row.active ? "Sim" : "Não"),
    },
    {
      key: "actions",
      label: "Ações",
      render: (row) => (
        <button className="ghost-button" type="button" onClick={() => toggleActive(row)}>
          {row.active ? "Desativar" : "Ativar"}
        </button>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="Loja"
        description="Gerencie itens, preços, raridades e efeitos."
      />

      <ErrorMessage message={error} />

      <section className="admin-form-panel">
        <h2>Novo item</h2>

        <form className="admin-form-grid" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Tipo
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="consumable">Consumível</option>
              <option value="equipment">Equipamento</option>
              <option value="relic">Relíquia</option>
              <option value="cosmetic">Cosmético</option>
            </select>
          </label>

          <label>
            Slot
            <select name="slot" value={form.slot} onChange={handleChange}>
              <option value="none">Nenhum</option>
              <option value="weapon">Arma</option>
              <option value="armor">Armadura</option>
              <option value="shield">Escudo</option>
              <option value="relic">Relíquia</option>
            </select>
          </label>

          <label>
            Preço
            <input name="price" type="number" value={form.price} onChange={handleChange} />
          </label>

          <label>
            Raridade
            <select name="rarity" value={form.rarity} onChange={handleChange}>
              <option value="common">Comum</option>
              <option value="uncommon">Incomum</option>
              <option value="rare">Rara</option>
              <option value="epic">Épica</option>
              <option value="legendary">Lendária</option>
            </select>
          </label>

          <label>
            Descrição
            <input name="description" value={form.description} onChange={handleChange} />
          </label>

          <label className="admin-form-wide">
            Effect JSON
            <textarea name="effect" value={form.effect} onChange={handleChange} />
          </label>

          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Criando..." : "Criar item"}
          </button>
        </form>
      </section>

      {loading ? (
        <Loading text="Carregando itens..." />
      ) : (
        <AdminTable columns={columns} rows={items} />
      )}
    </div>
  );
}
