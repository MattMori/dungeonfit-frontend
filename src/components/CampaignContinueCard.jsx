import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  ScrollText,
} from "lucide-react";

import { listCampaigns } from "../services/campaignService";
import { BRAND } from "../config/brand";

import "../styles/dashboard-campaign-card.css";

export default function CampaignContinueCard() {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        const campaigns = await listCampaigns();

        const active =
          campaigns.find((item) => item.progress?.status === "active") ||
          campaigns.find((item) => !item.progress) ||
          campaigns[0];

        if (mounted) {
          setCampaign(active || null);
        }
      } catch {
        if (mounted) {
          setCampaign(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;

  if (!campaign) {
    return (
      <section className="dashboard-campaign-card">
        <div className="dashboard-campaign-orbit" />

        <div className="dashboard-campaign-icon">
          <ScrollText size={28} />
        </div>

        <div className="dashboard-campaign-content">
          <span className="eyebrow">{BRAND.name}</span>
          <h2>A mesa não apareceu. A campanha continua.</h2>
          <p>
            Nenhuma campanha ativa encontrada. Rode o seed ou inicie sua primeira
            crônica solo.
          </p>

          <div className="dashboard-campaign-actions">
            <Link className="primary-button" to="/campanhas">
              Ver campanhas
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const progress = campaign.progress;
  const isStarted = Boolean(progress);
  const isCompleted = progress?.status === "completed";
  const pendingMission = progress?.pending_real_mission;
  const href = isStarted ? `/campanhas/${campaign.slug}` : "/campanhas";

  return (
    <section className="dashboard-campaign-card">
      <div className="dashboard-campaign-orbit" />

      <div className="dashboard-campaign-icon">
        {isCompleted ? <CheckCircle2 size={28} /> : <ScrollText size={28} />}
      </div>

      <div className="dashboard-campaign-content">
        <span className="eyebrow">
          {isCompleted
            ? "Crônica concluída"
            : isStarted
              ? "Campanha ativa"
              : BRAND.name}
        </span>

        <h2>
          {isCompleted
            ? "A crônica foi registrada."
            : isStarted
              ? "Continuar campanha"
              : BRAND.tagline}
        </h2>

        <p>
          <strong>{campaign.title}</strong>
          {isStarted && !isCompleted
            ? ` · capítulo ${progress.current_chapter_order}`
            : " · fantasia sombria solo"}
        </p>

        {pendingMission ? (
          <div className="dashboard-campaign-mission">
            <Dumbbell size={17} />
            <span>
              Missão real pendente: <strong>{pendingMission.title}</strong>
            </span>
          </div>
        ) : (
          <div className="dashboard-campaign-mission muted">
            <Clock3 size={17} />
            <span>
              {isCompleted
                ? "Campanha encerrada. Limpe o progresso em desenvolvimento para testar novamente."
                : isStarted
                  ? "Próximo passo: fazer uma escolha no capítulo atual."
                  : "Crie sua ficha, inicie a história e avance com ações reais."}
            </span>
          </div>
        )}

        <div className="dashboard-campaign-actions">
          <Link className="primary-button" to={href}>
            {isCompleted
              ? "Ver crônica"
              : isStarted
                ? "Continuar capítulo"
                : "Ver campanhas"}
            <ArrowRight size={18} />
          </Link>

          <Link className="ghost-button" to="/missoes">
            Missões reais
          </Link>
        </div>
      </div>
    </section>
  );
}
