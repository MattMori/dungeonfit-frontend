import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, HeartPulse, Skull, Trophy } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import EnemyCard from "../components/combat/EnemyCard";
import CombatLog from "../components/combat/CombatLog";
import CombatActionBar from "../components/combat/CombatActionBar";

import { getCombatSession, sendCombatAction } from "../services/combatService";

import "../styles/combat.css";

export default function CombatArena() {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState("");

  async function loadSession() {
    setLoading(true);
    setError("");

    try {
      const response = await getCombatSession(sessionId);
      setSession(response);

      const firstAlive = response.enemies_state?.find((enemy) => !enemy.defeated);
      setSelectedTarget((current) => current || firstAlive?.instance_id || "");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar combate.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const hpPercent = useMemo(() => {
    if (!session) return 0;
    return Math.max(
      0,
      Math.round((session.character_hp_current / session.character_hp_max) * 100),
    );
  }, [session]);

  async function handleAction(action) {
    setActing(true);
    setError("");

    try {
      const response = await sendCombatAction(sessionId, {
        action,
        target_id: selectedTarget,
      });

      setSession(response);

      const firstAlive = response.enemies_state?.find((enemy) => !enemy.defeated);
      setSelectedTarget(firstAlive?.instance_id || "");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao processar ação.");
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return <Loading text="Entrando na arena..." />;
  }

  if (!session) {
    return (
      <div className="combat-page">
        <ErrorMessage message={error} />
        <EmptyState
          title="Combate não encontrado."
          description="A sessão pode ter expirado ou não pertence ao seu personagem."
        />
      </div>
    );
  }

  const ended = session.status !== "active";

  return (
    <div className="combat-page">
      <Link className="ghost-button" to="/campanhas">
        <ArrowLeft size={18} />
        Voltar
      </Link>

      <section className={`combat-hero ${session.status}`}>
        <div>
          <span className="eyebrow">Combate Solo</span>
          <h1>{session.encounter_id?.title || "Encontro"}</h1>
          <p>{session.encounter_id?.description || "A arena foi aberta."}</p>
        </div>

        <div className="combat-status-orb">
          {session.status === "won" ? <Trophy size={34} /> : <Skull size={34} />}
          <strong>{session.status}</strong>
          <span>Rodada {session.round}</span>
        </div>
      </section>

      <ErrorMessage message={error} />

      <section className="combat-grid">
        <div className="combat-main">
          <article className="combat-character-card">
            <div>
              <span className="eyebrow">Personagem</span>
              <h2>HP atual</h2>
            </div>

            <HeartPulse size={24} />

            <div className="combat-hp-track big">
              <div style={{ width: `${hpPercent}%` }} />
            </div>

            <strong>
              {session.character_hp_current}/{session.character_hp_max} HP
            </strong>
          </article>

          <section className="combat-enemies-grid">
            {session.enemies_state.map((enemy) => (
              <EnemyCard
                key={enemy.instance_id}
                enemy={enemy}
                selected={selectedTarget === enemy.instance_id}
                onSelect={setSelectedTarget}
              />
            ))}
          </section>

          {ended ? (
            <section className="combat-ended-panel">
              <span className="eyebrow">Resultado</span>
              <h2>
                {session.status === "won"
                  ? "Você venceu o encontro."
                  : session.status === "escaped"
                    ? "Você escapou."
                    : "Você caiu em combate."}
              </h2>
              <p>
                {session.xp_awarded > 0
                  ? `XP recebido: ${session.xp_awarded}.`
                  : "Nenhum XP recebido."}
              </p>
            </section>
          ) : (
            <CombatActionBar disabled={acting} onAction={handleAction} />
          )}
        </div>

        <CombatLog log={session.log} />
      </section>
    </div>
  );
}
