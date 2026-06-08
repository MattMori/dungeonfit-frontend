import { Sparkles } from "lucide-react";

import "../../styles/social.css";

export default function TitleSelector({ titles = [], equippedId, onEquip, saving }) {
  return (
    <section className="social-panel">
      <div className="social-panel-heading">
        <div>
          <span className="eyebrow">Título</span>
          <h2>Título equipado</h2>
        </div>
        <Sparkles size={22} />
      </div>

      <div className="title-selector-list">
        <button
          type="button"
          className={!equippedId ? "active" : ""}
          disabled={saving}
          onClick={() => onEquip(null)}
        >
          Sem título
        </button>

        {titles.map((title) => (
          <button
            key={title._id}
            type="button"
            className={equippedId === title._id ? "active" : ""}
            disabled={saving}
            onClick={() => onEquip(title._id)}
          >
            {title.name}
          </button>
        ))}
      </div>

      {titles.length === 0 && (
        <p>Você ainda não desbloqueou relíquias do tipo título.</p>
      )}
    </section>
  );
}
