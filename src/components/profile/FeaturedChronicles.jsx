import { ScrollText } from "lucide-react";

import "../../styles/profile.css";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function FeaturedChronicles({ chronicles = [] }) {
  return (
    <section className="profile-panel">
      <span className="eyebrow">Crônicas</span>
      <h2>Feitos fixados</h2>

      {chronicles.length ? (
        <div className="chronicle-showcase-list">
          {chronicles.map((event) => (
            <article key={event._id}>
              <ScrollText size={20} />
              <div>
                <strong>{event.title}</strong>
                <span>{event.type} · {formatDate(event.createdAt)}</span>
                <p>{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>Nenhuma crônica fixada ainda.</p>
      )}
    </section>
  );
}
