import "../../styles/profile.css";

export default function TitleSelector({ relics = [], currentTitleId, disabled, onSelect }) {
  const titles = relics.filter((relic) => ["title", "achievement"].includes(relic.type));

  return (
    <section className="profile-panel">
      <span className="eyebrow">Título</span>
      <h2>Título equipado</h2>

      {titles.length ? (
        <div className="title-selector-list">
          <button
            className={!currentTitleId ? "selected" : ""}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(null)}
          >
            Nenhum título
          </button>

          {titles.map((title) => (
            <button
              key={title._id}
              className={String(currentTitleId || "") === String(title._id) ? "selected" : ""}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(title._id)}
            >
              {title.name}
            </button>
          ))}
        </div>
      ) : (
        <p>Você ainda não possui títulos. A Primeira Jornada resolve isso.</p>
      )}
    </section>
  );
}
