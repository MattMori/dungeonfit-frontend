import "../../styles/inventory-combat.css";

export default function ResourceTracker({ spellSlots = {}, temporaryEffects = [] }) {
  const slotEntries = Object.entries(spellSlots || {});

  return (
    <section className="resource-tracker">
      <span className="eyebrow">Recursos</span>
      <h2>Slots e efeitos</h2>

      {slotEntries.length ? (
        <div className="resource-chip-list">
          {slotEntries.map(([level, slot]) => (
            <span key={level}>
              {level === "pact" ? `Pacto ${slot.slot_level}` : `Nível ${level}`}:{" "}
              {Number(slot.max || 0) - Number(slot.used || 0)}/{slot.max}
            </span>
          ))}
        </div>
      ) : (
        <p>Nenhum slot disponível.</p>
      )}

      {temporaryEffects?.length > 0 && (
        <div className="resource-effect-list">
          {temporaryEffects.map((effect, index) => (
            <span key={`${effect.type}-${index}`}>
              {effect.type} · {effect.remaining_rounds} rodada(s)
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
