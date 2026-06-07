import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Crown,
  Dumbbell,
  Flame,
  Plus,
  Shield,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { useAsync } from "../hooks/useAsync";
import { getDashboard } from "../services/dashboardService";
import { formatDateTime, normalizeArray } from "../utils/formatters";

import "../styles/dashboard.css";

function getCharacterName(character) {
  return (
    character?.nome_personagem ||
    character?.name ||
    character?.nome ||
    "Herói sem ficha"
  );
}

function getCharacterClass(character) {
  return character?.classe || character?.class || "Classe não definida";
}

function getCharacterRace(character) {
  return character?.raca || character?.race || "Raça não definida";
}

function getLevel(user, character) {
  return (
    character?.nivel || character?.level || user?.nivel || user?.level || 1
  );
}

function getTotalXp(user, character) {
  return (
    character?.experiencia ||
    character?.xp ||
    user?.xp_total ||
    user?.totalXp ||
    user?.xp ||
    0
  );
}

function getStreak(progress, user) {
  return progress?.streak || user?.streak || 0;
}

function DashboardStat({ icon, label, value, hint }) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {hint && <small>{hint}</small>}
      </div>
    </article>
  );
}

function MissionRow({ activity }) {
  return (
    <div className="dashboard-mission-row">
      <div className="dashboard-mission-main">
        <div className="dashboard-mission-icon">
          <Dumbbell size={18} />
        </div>

        <div>
          <strong>
            {activity.name || activity.title || "Missão sem nome"}
          </strong>
          <span>
            {activity.type || activity.category || "atividade"} · +
            {activity.xp || activity.xp_ganho || 0} XP
          </span>
        </div>
      </div>

      <Link className="dashboard-row-action" to="/missoes">
        {" "}
        Ver
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function LogRow({ log }) {
  return (
    <div className="dashboard-log-row">
      <div>
        <strong>
          {log.activity_name || log.activity?.name || "Atividade"}
        </strong>
        <span>{formatDateTime(log.createdAt || log.completed_at)}</span>
      </div>

      <span className="dashboard-xp-badge">
        +{log.xp_gained || log.xp || 0} XP
      </span>
    </div>
  );
}

function RewardRow({ reward }) {
  return (
    <div className="dashboard-reward-row">
      <div className="dashboard-reward-icon">
        <Trophy size={17} />
      </div>

      <div>
        <strong>{reward.name || reward.title || "Recompensa"}</strong>
        <span>{reward.type || reward.rarity || "relíquia"}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, error } = useAsync(getDashboard, []);

  const user = data?.user || data?.usuario || {};
  const character = data?.character || data?.personagem || {};
  const progress = data?.progress || {};

  const activities = normalizeArray(
    data?.todayActivities || data?.activitiesOfDay || data?.activities,
    "activities",
  );

  const logs = normalizeArray(data?.recentLogs || data?.logs, "logs");

  const rewards = normalizeArray(
    data?.unlockedRewards || data?.rewards,
    "rewards",
  );

  const nextRewards = normalizeArray(data?.nextRewards, "rewards");

  const boss = data?.weeklyBoss ||
    data?.boss || {
      name: "Ogro da Preguiça",
      description:
        "Complete atividades durante a semana para reduzir a vida do boss.",
      progress: 0,
    };

  const characterName = getCharacterName(character);
  const characterClass = getCharacterClass(character);
  const characterRace = getCharacterRace(character);
  const level = getLevel(user, character);
  const totalXp = getTotalXp(user, character);
  const streak = getStreak(progress, user);

  const hasCharacter =
    character?._id ||
    character?.id ||
    character?.nome_personagem ||
    character?.name ||
    character?.nome;

  if (loading) {
    return <Loading text="Carregando painel da guilda..." />;
  }

  const firstActivity = activities[0];

  return (
    <div className="dashboard-page">
      <ErrorMessage message={error} />

      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">Salão da Guilda</span>

          <h1>A campanha continua.</h1>

          <p>
            Complete missões, mantenha sua sequência e transforme esforço real
            em XP, recompensas e evolução do seu personagem.
          </p>

          <div className="dashboard-hero-actions">
            <Link className="primary-button" to="/atividades/nova">
              <Plus size={18} />
              Nova atividade
            </Link>

            <Link className="ghost-button" to="/personagem">
              <Shield size={18} />
              Ver ficha
            </Link>
          </div>
        </div>

        <aside className="dashboard-character-card">
          <div className="dashboard-character-token">
            <Shield size={38} />
          </div>

          <div>
            <span className="eyebrow">Personagem ativo</span>

            <h2>{characterName}</h2>

            <p>
              {hasCharacter
                ? `${characterRace} · ${characterClass} · nível ${level}`
                : "Crie sua ficha para começar a progressão completa."}
            </p>
          </div>

          {!hasCharacter && (
            <Link className="dashboard-character-link" to="/personagem">
              Criar ficha
              <ArrowRight size={16} />
            </Link>
          )}
        </aside>
      </section>

      <section className="dashboard-stats-grid">
        <DashboardStat
          label="Nível"
          value={level}
          hint="Progressão do herói"
          icon={<Crown size={21} />}
        />

        <DashboardStat
          label="XP total"
          value={totalXp}
          hint="Experiência acumulada"
          icon={<Sparkles size={21} />}
        />

        <DashboardStat
          label="Streak"
          value={`${streak} dia${Number(streak) === 1 ? "" : "s"}`}
          hint="Sequência atual"
          icon={<Flame size={21} />}
        />

        <DashboardStat
          label="Missões hoje"
          value={activities.length}
          hint="Atividades disponíveis"
          icon={<Activity size={21} />}
        />
      </section>

      <section className="dashboard-main-grid">
        <article className="dashboard-panel dashboard-quest-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="eyebrow">Missão principal</span>
              <h2>
                {firstActivity?.name ||
                  firstActivity?.title ||
                  "Escolha sua próxima missão"}
              </h2>
            </div>

            <Swords size={24} />
          </div>

          {firstActivity ? (
            <>
              <p>
                Complete esta atividade para gerar XP e manter sua progressão
                ativa dentro da campanha.
              </p>

              <div className="dashboard-quest-reward">
                <span>Recompensa</span>
                <strong>
                  +{firstActivity.xp || firstActivity.xp_ganho || 0} XP
                </strong>
              </div>

              <Link className="dashboard-panel-button" to="/missoes">
                {" "}
                Abrir missões
                <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <EmptyState
              title="Nenhuma missão ativa."
              description="Crie uma atividade para começar a gerar XP hoje."
              action={
                <Link className="primary-button" to="/atividades/nova">
                  <Plus size={18} />
                  Criar missão
                </Link>
              }
            />
          )}
        </article>

        <article className="dashboard-panel dashboard-boss-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="eyebrow">Boss semanal</span>
              <h2>{boss?.name || "Ogro da Preguiça"}</h2>
            </div>

            <Flame size={24} />
          </div>

          <p>
            {boss?.description ||
              "Complete atividades durante a semana para reduzir a vida do boss."}
          </p>

          <div className="dashboard-boss-progress">
            <div>
              <span>Progresso</span>
              <strong>{boss?.progress || boss?.hp || 0}%</strong>
            </div>

            <div className="dashboard-progress-bar">
              <span
                style={{
                  width: `${Math.min(boss?.progress || boss?.hp || 0, 100)}%`,
                }}
              />
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-content-grid">
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="eyebrow">Hoje</span>
              <h2>Atividades do dia</h2>
            </div>

            <Link to="/atividades">Ver todas</Link>
          </div>

          {activities.length === 0 ? (
            <EmptyState
              title="Nenhuma atividade para hoje."
              description="Crie uma atividade para começar a gerar XP."
            />
          ) : (
            <div className="dashboard-list">
              {activities.slice(0, 5).map((activity) => (
                <MissionRow
                  key={activity._id || activity.id}
                  activity={activity}
                />
              ))}
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="eyebrow">Crônicas</span>
              <h2>Últimos registros</h2>
            </div>
            <Link to="/cronicas">Histórico</Link>{" "}
          </div>

          {logs.length === 0 ? (
            <EmptyState
              title="Nenhum registro ainda."
              description="Conclua uma atividade para escrever a primeira linha da sua crônica."
            />
          ) : (
            <div className="dashboard-list">
              {logs.slice(0, 6).map((log) => (
                <LogRow key={log._id || log.id} log={log} />
              ))}
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="eyebrow">Relíquias</span>
              <h2>Recompensas</h2>
            </div>
            <Link to="/reliquias">Ver</Link>{" "}
          </div>

          {rewards.length === 0 && nextRewards.length === 0 ? (
            <EmptyState
              title="Nenhuma recompensa desbloqueada ainda."
              description="Continue completando missões para encontrar sua primeira relíquia."
            />
          ) : (
            <div className="dashboard-list">
              {[...rewards, ...nextRewards].slice(0, 5).map((reward) => (
                <RewardRow key={reward._id || reward.id} reward={reward} />
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-footer-cta">
        <div>
          <span className="eyebrow">Próximo passo</span>

          <h2>Não quebre a sequência.</h2>

          <p>
            Uma missão pequena hoje ainda conta como progresso. O herói não
            precisa vencer a guerra em um dia; só precisa não abandonar a
            campanha.
          </p>
        </div>

        <Link className="primary-button" to="/atividades/nova">
          <Dumbbell size={18} />
          Registrar esforço
        </Link>
      </section>
    </div>
  );
}
