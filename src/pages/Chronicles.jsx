import { useEffect, useState } from "react";
import { Dice5, ScrollText, Sparkles } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { listChronicles } from "../services/cronariumService";

import "../styles/cronarium-modules.css";

const TYPE_LABELS = {
  CHARACTER_CREATED: "Ficha criada",
  CAMPAIGN_STARTED: "Campanha iniciada",
  CHAPTER_STARTED: "Capítulo iniciado",
  CHOICE_MADE: "Escolha feita",
  REAL_MISSION_ASSIGNED: "Missão recebida",
  REAL_MISSION_COMPLETED: "Missão concluída",
  XP_GAINED: "XP ganho",
  RELIC_UNLOCKED: "Relíquia",
  CAMPAIGN_COMPLETED: "Campanha concluída",
  LEVEL_UP: "Level up",
  FREE_REAL_MISSION_CREATED: "Missão livre criada",
  FREE_REAL_MISSION_COMPLETED: "Missão livre concluída",
};

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getIcon(type) {
  if (type === "CHOICE_MADE") return <Dice5 size={20} />;
  if (type === "RELIC_UNLOCKED") return <Sparkles size={20} />;
  return <ScrollText size={20} />;
}

export default function Chronicles() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      setEvents(await listChronicles(filter ? { type: filter } : {}));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar crônicas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [filter]);

  return (
    <div>
      <PageHeader
        eyebrow="Crônicas"
        title="Linha do tempo"
        description="Escolhas, testes, missões reais, relíquias e marcos da sua jornada."
      />

      <div className="filters">
        {[
          ["", "Tudo"],
          ["CHOICE_MADE", "Escolhas"],
          ["REAL_MISSION_COMPLETED", "Missões"],
          ["RELIC_UNLOCKED", "Relíquias"],
          ["CAMPAIGN_COMPLETED", "Campanhas"],
        ].map(([value, label]) => (
          <button
            key={label}
            className={filter === value ? "active" : ""}
            onClick={() => setFilter(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando crônicas..." />
      ) : events.length === 0 ? (
        <EmptyState
          title="Nenhum registro ainda."
          description="Inicie uma campanha, faça escolhas e conclua missões reais para escrever sua crônica."
        />
      ) : (
        <section className="chronicle-timeline">
          {events.map((event) => (
            <article className="chronicle-event-card" key={event._id}>
              <div className="chronicle-event-icon">{getIcon(event.type)}</div>

              <div>
                <span className="eyebrow">
                  {TYPE_LABELS[event.type] || event.type} · {formatDate(event.createdAt)}
                </span>

                <h3>{event.title}</h3>

                {event.description && <p>{event.description}</p>}

                <div className="chronicle-event-meta">
                  {event.campaign_id?.title && <span>{event.campaign_id.title}</span>}
                  {event.chapter_order && <span>Capítulo {event.chapter_order}</span>}
                  {event.xp_delta > 0 && <span>+{event.xp_delta} XP</span>}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
