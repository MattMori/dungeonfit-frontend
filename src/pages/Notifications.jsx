import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import NotificationCard from "../components/notifications/NotificationCard";

import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";

import "../styles/retention.css";

export default function Notifications() {
  const [data, setData] = useState({ items: [], unread_count: 0 });
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    setLoading(true);
    setError("");

    try {
      setData(await listNotifications());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar notificações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleRead(id) {
    setBusyId(id);
    setError("");

    try {
      await markNotificationRead(id);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao marcar notificação.");
    } finally {
      setBusyId("");
    }
  }

  async function handleReadAll() {
    setError("");

    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao marcar todas.");
    }
  }

  return (
    <div className="retention-page">
      <PageHeader
        eyebrow="Central"
        title="Notificações"
        description="Tudo que sua jornada quer que você não esqueça."
        action={
          <button className="ghost-button" type="button" onClick={handleReadAll}>
            Marcar todas como lidas
          </button>
        }
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando notificações..." />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="Nenhuma notificação."
          description="Quando algo importante acontecer, aparece aqui."
        />
      ) : (
        <section className="notification-list">
          {data.items.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              busy={busyId === notification._id}
              onRead={handleRead}
            />
          ))}
        </section>
      )}
    </div>
  );
}
