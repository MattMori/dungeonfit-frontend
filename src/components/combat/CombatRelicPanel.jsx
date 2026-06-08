import "../../styles/inventory-combat.css";

export default function CombatRelicPanel({ relics = [], usedRelics = [], disabled, onUse }) {
  const equippedRelics = relics.filter((relic) => relic.equipped);

  return (
    <section className="combat-resource-panel">
      <span className="eyebrow">Relíquias</span>
      <h2>Ativar</h2>

      {equippedRelics.length ? (
        <div className="combat-resource-list">
          {equippedRelics.map((relic) => {
            const used = usedRelics.includes(String(relic._id));

            return (
              <button
                key={relic._id}
                className="resource-action-card"
                type="button"
                disabled={disabled || used}
                onClick={() => onUse(relic._id)}
              >
                <strong>{relic.name}</strong>
                <span>{used ? "usada neste combate" : relic.rarity}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <p>Nenhuma relíquia equipada.</p>
      )}
    </section>
  );
}
