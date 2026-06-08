import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";

import "../../styles/social.css";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function GuildFeedItem({ event }) {
  const username = event.profile?.username;
  const name = event.profile?.public_name || "Aventureiro";

  return (
    <article className="guild-feed-item">
      <div className="feed-icon">
        <ScrollText size={18} />
      </div>

      <div>
        <span className="eyebrow">{formatDate(event.createdAt)}</span>

        <h3>
          {username ? <Link to={`/perfil/${username}`}>{name}</Link> : name}
          {" "}· {event.title}
        </h3>

        {event.description && <p>{event.description}</p>}

        {event.xp_delta > 0 && <strong>+{event.xp_delta} XP</strong>}
      </div>
    </article>
  );
}
