import { useEffect, useState } from "react";
import { Skull, Trophy } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import BossProgressBar from "../components/routine/BossProgressBar";

import {
  claimWeeklyBossReward,
  getWeeklyBoss,
} from "../services/weeklyBossService";

import "../styles/retention.css";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function WeeklyBoss() {
  const [data, setData] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadBoss() {
    setLoading(true);
    setError("");

    try {
      setData(await getWeeklyBoss());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar boss semanal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoss();
  }, []);

  async function handleClaim() {
    if (!data?.boss?._id) return;

    setClaiming(true);
    setError("");
    setSuccess("");

    try {
      await claimWeeklyBossReward(data.boss._id);
      setSuccess("Recompensa semanal resgatada.");
      await loadBoss();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao resgatar recompensa.");
    } finally {
      setClaiming(false);
    }
  }

  if (loading) {
    return <Loading text="Invocando boss semanal..." />;
  }

  if (!data?.boss) {
    return (
      <div className="retention-page">
        <PageHeader
          eyebrow="Boss"
          title="Boss Semanal"
          description="Nenhum desafio semanal ativo."
        />

        <EmptyState
          title="Nenhum boss ativo."
          description="Rode o seed de boss semanal ou aguarde a próxima semana."
        />
      </div>
    );
  }

  const { boss, progress } = data;

  return (
    <div className="retention-page">
      <PageHeader
        eyebrow="Boss"
        title={boss.title}
        description={boss.description}
      />

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="weekly-boss-detail">
        <div>
          <span className="eyebrow">
            {formatDate(boss.starts_at)} → {formatDate(boss.ends_at)}
          </span>

          <h2>
            {data.hp_remaining <= 0
              ? "Boss derrotado"
              : `${data.hp_remaining} HP restantes`}
          </h2>

          <BossProgressBar
            percent={data.damage_percent}
            label={`${progress?.damage_dealt || 0}/${boss.hp} dano`}
          />

          <div className="boss-reward-grid">
            <article>
              <Trophy size={20} />
              <strong>{boss.rewards?.ecos || 0} Ecos</strong>
            </article>

            <article>
              <Trophy size={20} />
              <strong>{boss.rewards?.xp || 0} XP</strong>
            </article>

            {boss.rewards?.relic_name && (
              <article>
                <Trophy size={20} />
                <strong>{boss.rewards.relic_name}</strong>
              </article>
            )}

            {boss.rewards?.title_name && (
              <article>
                <Trophy size={20} />
                <strong>{boss.rewards.title_name}</strong>
              </article>
            )}
          </div>

          {data.can_claim && (
            <button className="primary-button" type="button" disabled={claiming} onClick={handleClaim}>
              <Trophy size={18} />
              {claiming ? "Resgatando..." : "Resgatar recompensa"}
            </button>
          )}

          {progress?.status === "claimed" && (
            <p>Recompensa já resgatada. Belo trabalho, caçador de boleto existencial.</p>
          )}
        </div>

        <Skull size={72} />
      </section>
    </div>
  );
}
