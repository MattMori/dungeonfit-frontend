import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

import { listNotifications, markNotificationRead } from "../../services/notificationService";

import "../../styles/retention.css";

export default function NotificationBell() {
  const [data, setData] = useState({ items: [], unread_count: 0 });
  const [open, setOpen] = useState(false);

  async function loadNotifications() {
    try {
      setData(await listNotifications({ limit: 8 }));
    } catch {
      setData({ items: [], unread_count: 0 });
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleOpenNotification(item) {
    if (!item.read) {
      await markNotificationRead(item._id);
      await loadNotifications();
    }
  }

  return (
    <div className="notification-bell">
      <button type="button" onClick={() => setOpen((value) => !value)}>
        <Bell size={20} />
        {data.unread_count > 0 && <span>{data.unread_count}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <strong>Notificações</strong>

          {data.items.length ? (
            data.items.map((item) => (
              <Link
                key={item._id}
                to={item.action_url || "/notificacoes"}
                className={item.read ? "read" : ""}
                onClick={() => handleOpenNotification(item)}
              >
                <span>{item.title}</span>
                <small>{item.message}</small>
              </Link>
            ))
          ) : (
            <p>Nada novo por enquanto.</p>
          )}

          <Link className="notification-view-all" to="/notificacoes">
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}
