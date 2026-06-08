import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

import "../../styles/retention.css";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function NotificationCard({ notification, onRead, busy }) {
  return (
    <article className={`notification-card ${notification.read ? "read" : ""}`}>
      <div className="notification-icon">
        <Bell size={20} />
      </div>

      <div>
        <span className="eyebrow">{notification.type} · {formatDate(notification.createdAt)}</span>
        <h3>{notification.title}</h3>
        <p>{notification.message}</p>

        <div className="notification-actions">
          {notification.action_url && (
            <Link className="primary-button" to={notification.action_url}>
              Abrir
            </Link>
          )}

          {!notification.read && (
            <button className="ghost-button" type="button" disabled={busy} onClick={() => onRead(notification._id)}>
              Marcar como lida
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
