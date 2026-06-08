import { Sparkles } from "lucide-react";

import "../../styles/profile.css";

export default function FeaturedRelics({ relics = [] }) {
  return (
    <section className="profile-panel">
      <span className="eyebrow">Relíquias</span>
      <h2>Troféus em destaque</h2>

      {relics.length ? (
        <div className="featured-grid">
          {relics.map((relic) => (
            <article key={relic._id}>
              <Sparkles size={22} />
              <strong>{relic.name}</strong>
              <span>{relic.rarity}</span>
              <p>{relic.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>Nenhuma relíquia destacada ainda.</p>
      )}
    </section>
  );
}
