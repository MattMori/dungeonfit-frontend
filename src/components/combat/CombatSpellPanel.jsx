import "../../styles/inventory-combat.css";

export default function CombatSpellPanel({ character, disabled, onCast }) {
  const magias = character?.magias || {};
  const spells = [
    ...(magias.truques || []).map((slug) => ({ slug, type: "truque" })),
    ...(magias.conhecidas || []).map((slug) => ({ slug, type: "magia" })),
    ...(magias.preparadas || []).map((slug) => ({ slug, type: "preparada" })),
  ];

  return (
    <section className="combat-resource-panel">
      <span className="eyebrow">Magias</span>
      <h2>Conjurar</h2>

      {spells.length ? (
        <div className="combat-resource-list">
          {Array.from(new Map(spells.map((spell) => [spell.slug, spell])).values()).map((spell) => (
            <button
              key={spell.slug}
              className="resource-action-card"
              type="button"
              disabled={disabled}
              onClick={() => onCast(spell.slug)}
            >
              <strong>{spell.slug.replaceAll("-", " ")}</strong>
              <span>{spell.type}</span>
            </button>
          ))}
        </div>
      ) : (
        <p>Nenhuma magia conhecida/preparada.</p>
      )}
    </section>
  );
}
