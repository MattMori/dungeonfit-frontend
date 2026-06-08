import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Copy, LogOut, Shield, Users } from "lucide-react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import GuildFeedItem from "../components/social/GuildFeedItem";

import {
  getGuild,
  getGuildFeed,
  getGuildRanking,
  joinGuild,
  leaveGuild,
  listGuildMembers,
} from "../services/guildService";

import "../styles/social.css";

export default function GuildDetail() {
  const { slug } = useParams();

  const [guildData, setGuildData] = useState(null);
  const [members, setMembers] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const guild = guildData?.guild;
  const membership = guildData?.membership;

  async function loadGuild() {
    setLoading(true);
    setError("");

    try {
      const response = await getGuild(slug);
      setGuildData(response);

      const [membersResponse, rankingResponse, feedResponse] = await Promise.all([
        listGuildMembers(slug),
        getGuildRanking(slug),
        getGuildFeed(slug),
      ]);

      setMembers(membersResponse);
      setRanking(rankingResponse);
      setFeed(feedResponse);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar guilda.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGuild();
  }, [slug]);

  async function handleJoin() {
    setJoining(true);
    setError("");
    setSuccess("");

    try {
      await joinGuild(slug);
      setSuccess("Você entrou na guilda.");
      await loadGuild();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao entrar na guilda.");
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    const confirmed = window.confirm("Sair desta guilda?");
    if (!confirmed) return;

    setLeaving(true);
    setError("");
    setSuccess("");

    try {
      await leaveGuild(slug);
      setSuccess("Você saiu da guilda.");
      await loadGuild();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao sair da guilda.");
    } finally {
      setLeaving(false);
    }
  }

  async function copyInviteCode() {
    if (!guild?.invite_code) return;

    await navigator.clipboard.writeText(guild.invite_code);
    setSuccess("Código copiado.");
  }

  if (loading) {
    return <Loading text="Carregando guilda..." />;
  }

  if (!guild) {
    return (
      <div className="social-page">
        <ErrorMessage message={error} />
        <EmptyState
          title="Guilda não encontrada."
          description="Essa guilda não está disponível."
        />
      </div>
    );
  }

  return (
    <div className="social-page">
      <section className="guild-hero">
        <div>
          <span className="eyebrow">
            {guild.visibility === "public" ? "Guilda pública" : "Guilda privada"}
          </span>
          <h1>{guild.name}</h1>
          <p>{guild.description || "Uma guilda do Cronarium."}</p>

          <div className="guild-meta-row">
            <span>
              <Users size={16} />
              {guild.member_count || 0} membros
            </span>
            <span>/{guild.slug}</span>
            {membership && <span>{membership.role}</span>}
          </div>
        </div>

        <div className="guild-hero-actions">
          {!membership && guild.visibility === "public" && (
            <button className="primary-button" type="button" onClick={handleJoin} disabled={joining}>
              {joining ? "Entrando..." : "Entrar na guilda"}
            </button>
          )}

          {membership && membership.role !== "owner" && (
            <button className="ghost-button danger" type="button" onClick={handleLeave} disabled={leaving}>
              <LogOut size={18} />
              {leaving ? "Saindo..." : "Sair"}
            </button>
          )}

          {membership && (
            <button className="ghost-button" type="button" onClick={copyInviteCode}>
              <Copy size={18} />
              Código {guild.invite_code}
            </button>
          )}
        </div>
      </section>

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      <section className="social-grid">
        <article className="social-panel">
          <div className="social-panel-heading">
            <div>
              <span className="eyebrow">Ranking</span>
              <h2>Ranking da Guilda</h2>
            </div>
            <Shield size={22} />
          </div>

          {ranking.length ? (
            <div className="guild-ranking-list">
              {ranking.map((item, index) => (
                <article key={String(item.user_id)}>
                  <strong>#{index + 1}</strong>

                  <div>
                    <Link to={`/perfil/${item.profile?.username || ""}`}>
                      {item.profile?.public_name || "Aventureiro"}
                    </Link>
                    <span>
                      {item.xp_total || 0} XP · {item.missions_completed || 0} missões ·{" "}
                      {item.relics_unlocked || 0} relíquias
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p>Sem ranking ainda.</p>
          )}
        </article>

        <article className="social-panel">
          <div className="social-panel-heading">
            <div>
              <span className="eyebrow">Membros</span>
              <h2>{members.length} aventureiros</h2>
            </div>
            <Users size={22} />
          </div>

          {members.length ? (
            <div className="social-mini-list">
              {members.map((member) => (
                <Link
                  to={`/perfil/${member.profile?.username || ""}`}
                  key={String(member.user_id)}
                >
                  <strong>{member.profile?.public_name || "Aventureiro"}</strong>
                  <span>{member.role}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p>Nenhum membro encontrado.</p>
          )}
        </article>
      </section>

      <section className="social-section">
        <div className="social-panel-heading">
          <div>
            <span className="eyebrow">Feed</span>
            <h2>Crônicas recentes da guilda</h2>
          </div>
          <Shield size={22} />
        </div>

        {feed.length ? (
          <div className="guild-feed-list">
            {feed.map((event) => (
              <GuildFeedItem event={event} key={event._id} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="A guilda ainda está silenciosa."
            description="Conclua missões, desbloqueie relíquias e avance campanhas para alimentar o feed."
          />
        )}
      </section>
    </div>
  );
}
