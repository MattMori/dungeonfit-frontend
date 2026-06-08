import "../../styles/inventory-combat.css";

export default function CombatItemPanel({ items = [], disabled, onUse }) {
  const consumables = items.filter((item) => item.type === "consumable" && item.quantity > 0);

  return (
    <section className="combat-resource-panel">
      <span className="eyebrow">Itens</span>
      <h2>Consumíveis</h2>

      {consumables.length ? (
        <div className="combat-resource-list">
          {consumables.map((item) => (
            <button
              key={item._id}
              className="resource-action-card"
              type="button"
              disabled={disabled}
              onClick={() => onUse(item._id)}
            >
              <strong>{item.name}</strong>
              <span>x{item.quantity}</span>
            </button>
          ))}
        </div>
      ) : (
        <p>Nenhum consumível disponível.</p>
      )}
    </section>
  );
}
