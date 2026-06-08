import { useEffect, useState } from "react";
import { Lock, Sparkles } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { listRelics } from "../services/cronariumService";

import "../styles/cronarium-modules.css";

const TYPE_LABELS = {
  narrative: "Narrativa",
  title: "Título",
  session_bonus: "Bônus de sessão",
  cosmetic: "Cosmético",
  sheet_item: "Item de ficha",
  memory: "Memória",
  achievement: "Conquista",
};

const RARITY_LABELS = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Rara",
  epic: "Épica",
  legendary: "Lendária",
};

export default function Relics() {
  const [relics, setRelics] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRelics() {
    setLoading(true);
    setError("");

    try {
      setRelics(await listRelics(filter ? { type: filter } : {}));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar relíquias.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRelics();
  }, [filter]);

  return (
    <div>
      <PageHeader
        eyebrow="Relíquias"
        title="Relíquias"
        description="Memórias, títulos, conquistas e itens obtidos durante suas campanhas."
      />

      <div className="filters">
        {[
          ["", "Todas"],
          ["memory", "Memórias"],
          ["narrative", "Narrativas"],
          ["achievement", "Conquistas"],
          ["title", "Títulos"],
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
        <Loading text="Carregando relíquias..." />
      ) : relics.length === 0 ? (
        <EmptyState
          title="Nenhuma relíquia desbloqueada."
          description="Conclua capítulos e missões reais de campanha para registrar suas primeiras relíquias."
        />
      ) : (
        <section className="cards-grid">
          {relics.map((relic) => (
            <article className="relic-card" key={relic._id}>
              <div className="relic-icon">
                {relic.unlocked_at ? <Sparkles size={22} /> : <Lock size={22} />}
              </div>

              <div>
                <span className="eyebrow">
                  {TYPE_LABELS[relic.type] || relic.type} ·{" "}
                  {RARITY_LABELS[relic.rarity] || relic.rarity}
                </span>

                <h3>{relic.name}</h3>

                <p>{relic.description || "Relíquia registrada no Cronarium."}</p>

                {relic.campaign_id?.title && (
                  <div className="relic-source">Origem: {relic.campaign_id.title}</div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
