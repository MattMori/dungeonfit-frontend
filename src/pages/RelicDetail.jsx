import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { listRelics } from "../services/cronariumService";

import "../styles/cronarium-experience.css";

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

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function RelicDetail() {
  const { id } = useParams();

  const [relic, setRelic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRelic() {
    setLoading(true);
    setError("");

    try {
      const relics = await listRelics();
      setRelic(relics.find((item) => item._id === id) || null);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar relíquia.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRelic();
  }, [id]);

  if (loading) {
    return <Loading text="Abrindo relíquia..." />;
  }

  if (!relic) {
    return (
      <div>
        <Link className="ghost-button" to="/reliquias">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <ErrorMessage message={error} />

        <EmptyState
          title="Relíquia não encontrada."
          description="Essa memória ainda não foi registrada no Cronarium."
        />
      </div>
    );
  }

  return (
    <div className="relic-detail-page">
      <Link className="ghost-button" to="/reliquias">
        <ArrowLeft size={18} />
        Voltar para relíquias
      </Link>

      <section className="relic-detail-hero">
        <div className="relic-detail-icon">
          <Sparkles size={44} />
        </div>

        <div>
          <span className="eyebrow">
            {TYPE_LABELS[relic.type] || relic.type} ·{" "}
            {RARITY_LABELS[relic.rarity] || relic.rarity}
          </span>

          <h1>{relic.name}</h1>

          <p>{relic.description || "Relíquia registrada no Cronarium."}</p>

          <div className="relic-detail-meta">
            <span>Obtida em {formatDate(relic.unlocked_at)}</span>
            {relic.campaign_id?.title && <span>{relic.campaign_id.title}</span>}
            {relic.equipped && <span>Equipada</span>}
          </div>
        </div>
      </section>

      <section className="experience-panel">
        <span className="eyebrow">Efeito</span>
        <h2>{Object.keys(relic.effect || {}).length ? "Efeito registrado" : "Efeito narrativo"}</h2>
        <p>
          {Object.keys(relic.effect || {}).length
            ? JSON.stringify(relic.effect, null, 2)
            : "Esta relíquia representa uma memória da sua jornada. Efeitos mecânicos podem ser adicionados em uma versão futura."}
        </p>
      </section>
    </div>
  );
}
