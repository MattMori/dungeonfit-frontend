import { Package, Shield, Sparkles } from "lucide-react";

import "../../styles/inventory-combat.css";

export default function InventoryItemCard({ item, onEquip, onUnequip, onUse, busy }) {
  const canEquip = ["equipment", "relic"].includes(item.type);
  const canUse = item.type === "consumable";

  return (
    <article className={`inventory-item-card ${item.equipped ? "equipped" : ""}`}>
      <div className="inventory-item-icon">
        {item.type === "relic" ? <Sparkles size={22} /> : item.type === "equipment" ? <Shield size={22} /> : <Package size={22} />}
      </div>

      <div>
        <span className="eyebrow">
          {item.type} · {item.slot}
        </span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>

        <div className="inventory-meta-row">
          <span>Qtd. {item.quantity}</span>
          {item.equipped && <span>Equipado</span>}
        </div>

        <div className="inventory-actions">
          {canEquip &&
            (item.equipped ? (
              <button className="ghost-button" type="button" disabled={busy} onClick={() => onUnequip(item._id)}>
                Desequipar
              </button>
            ) : (
              <button className="primary-button" type="button" disabled={busy} onClick={() => onEquip(item._id)}>
                Equipar
              </button>
            ))}

          {canUse && (
            <button className="ghost-button" type="button" disabled={busy || item.quantity <= 0} onClick={() => onUse(item._id)}>
              Usar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
