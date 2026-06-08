import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, HeartPulse, Shield, Sparkles, Trophy } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ProgressionBar from "../components/progression/ProgressionBar";
import UnlockedFeatureList from "../components/progression/UnlockedFeatureList";

import {
  confirmLevelUp,
  getLevelUpStatus,
  listLevelUpHistory,
} from "../services/levelUpService";

import "../styles/progression.css";

const CHOICE_LABELS = {
  subclasse: "Subclasse",
  incremento_atributo_ou_talento: "Incremento de atributo ou talento",
};

export default function LevelUpPage() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [choices, setChoices] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const character = data?.character;
  const status = data?.status;

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [statusResponse, historyResponse] = await Promise.all([
        getLevelUpStatus(),
        listLevelUpHistory(),
      ]);

      setData(statusResponse);
      setHistory(historyResponse);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar progressão.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChoiceChange(event) {
    const { name, value } = event.target;

    setChoices((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleConfirm() {
    setConfirming(true);
    setError("");
    setSuccess("");

    try {
      await confirmLevelUp(choices);
      setSuccess("Level up confirmado. A crônica foi registrada.");
      setChoices({});
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erro ao confirmar level up. Verifique escolhas pendentes.",
      );
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return <Loading text="Carregando progressão..." />;
  }

  if (!character || !status) {
    return (
      <div className="progression-page">
        <Link className="ghost-button" to="/evolucao">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <ErrorMessage message={error} />

        <EmptyState
          title="Ficha não encontrada."
          description="Crie uma ficha para desbloquear progressão de personagem."
        />
      </div>
    );
  }

  return (
    <div className="progression-page">
      <Link className="ghost-button" to="/evolucao">
        <ArrowLeft size={18} />
        Voltar para evolução
      </Link>

      <section className="progression-hero">
        <div>
          <span className="eyebrow">Level Up</span>
          <h1>{character.nome_personagem}</h1>
          <p>
            XP deixa de ser só número: quando você atinge um marco, sua ficha
            evolui de verdade.
          </p>
        </div>

        <div className="progression-level-orb">
          <span>NÍVEL</span>
          <strong>{status.current_level}</strong>
        </div>
      </section>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="progression-grid">
        <article className="progression-panel main">
          <span className="eyebrow">Progresso</span>

          <h2>
            {status.level_up_available
              ? `Você pode subir para o nível ${status.target_level}`
              : status.max_level_reached
                ? "Nível máximo atingido"
                : `Rumo ao nível ${status.next_level}`}
          </h2>

          <ProgressionBar
            percent={status.progress_percent}
            label={
              status.next_level
                ? `Progresso para nível ${status.next_level}`
                : "Nível máximo"
            }
            helper={
              status.next_level_xp
                ? `${status.xp} / ${status.next_level_xp} XP`
                : `${status.xp} XP`
            }
          />

          {status.level_up_available && (
            <div className="level-up-preview-grid">
              <article>
                <HeartPulse size={22} />
                <span>HP ganho</span>
                <strong>+{status.hp_gain}</strong>
              </article>

              <article>
                <Shield size={22} />
                <span>Proficiência</span>
                <strong>
                  +{status.proficiency_bonus_before} → +{status.proficiency_bonus_after}
                </strong>
              </article>

              <article>
                <Trophy size={22} />
                <span>Novo nível</span>
                <strong>{status.target_level}</strong>
              </article>
            </div>
          )}
        </article>

        <article className="progression-panel">
          <span className="eyebrow">Características</span>
          <h2>Desbloqueios</h2>

          <UnlockedFeatureList features={status.unlocked_features} />
        </article>
      </section>

      {status.level_up_available && status.requires_choices && (
        <section className="progression-panel">
          <span className="eyebrow">Escolhas pendentes</span>
          <h2>Complete as decisões deste nível</h2>

          <div className="level-up-choice-grid">
            {status.pending_choices.map((choiceKey) => (
              <label key={choiceKey}>
                {CHOICE_LABELS[choiceKey] || choiceKey}
                <input
                  name={choiceKey}
                  value={choices[choiceKey] || ""}
                  onChange={handleChoiceChange}
                  placeholder="Descreva sua escolha"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {status.level_up_available && (
        <section className="progression-confirm-panel">
          <div>
            <span className="eyebrow">Confirmar evolução</span>
            <h2>Registrar level up na crônica?</h2>
            <p>
              A ficha será atualizada com novo nível, HP, bônus de proficiência
              e características desbloqueadas.
            </p>
          </div>

          <button className="primary-button" type="button" onClick={handleConfirm} disabled={confirming}>
            <Sparkles size={18} />
            {confirming ? "Confirmando..." : "Confirmar level up"}
          </button>
        </section>
      )}

      <section className="progression-panel">
        <span className="eyebrow">Histórico</span>
        <h2>Level ups registrados</h2>

        {history.length ? (
          <div className="level-up-history-list">
            {history.map((item) => (
              <article key={item._id}>
                <strong>
                  Nível {item.from_level} → {item.to_level}
                </strong>
                <span>
                  HP +{item.hp_gained}
                  {item.unlocked_features?.length
                    ? ` · ${item.unlocked_features.join(", ")}`
                    : ""}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <p>Nenhum level up confirmado ainda.</p>
        )}
      </section>
    </div>
  );
}
