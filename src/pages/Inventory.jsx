import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import InventoryItemCard from "../components/inventory/InventoryItemCard";

import {
  equipInventoryItem,
  listInventory,
  unequipInventoryItem,
  useInventoryItem,
} from "../services/inventoryService";

import "../styles/inventory-combat.css";

export default function Inventory() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadInventory() {
    setLoading(true);
    setError("");

    try {
      setData(await listInventory());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar inventário.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function runAction(id, action, successMessage) {
    setBusyId(id);
    setError("");
    setSuccess("");

    try {
      await action(id);
      setSuccess(successMessage);
      await loadInventory();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar item.");
    } finally {
      setBusyId("");
    }
  }

  const items = data?.items || [];
  const visibleItems =
    activeTab === "all" ? items : items.filter((item) => item.type === activeTab);

  if (loading) {
    return <Loading text="Abrindo inventário..." />;
  }

  return (
    <div className="inventory-page">
      <PageHeader
        eyebrow="Inventário"
        title="Bolsa, relíquias e consumíveis"
        description="Gerencie recursos usados dentro e fora de combate."
      />

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <div className="inventory-tabs">
        {[
          ["all", "Tudo"],
          ["consumable", "Consumíveis"],
          ["equipment", "Equipamentos"],
          ["relic", "Relíquias"],
          ["quest", "Campanha"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={activeTab === value ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <EmptyState
          title="Inventário vazio."
          description="Itens podem ser adicionados como recompensas, seeds ou manualmente."
        />
      ) : (
        <section className="inventory-grid">
          {visibleItems.map((item) => (
            <InventoryItemCard
              key={item._id}
              item={item}
              busy={busyId === item._id}
              onEquip={(id) => runAction(id, equipInventoryItem, "Item equipado.")}
              onUnequip={(id) => runAction(id, unequipInventoryItem, "Item desequipado.")}
              onUse={(id) => runAction(id, useInventoryItem, "Item usado.")}
            />
          ))}
        </section>
      )}
    </div>
  );
}
