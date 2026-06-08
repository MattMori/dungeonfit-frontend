import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Archive, BookOpen, Edit3, Plus, Sparkles } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import { listMyCampaigns } from "../services/creatorService";

import "../styles/creator.css";

const STATUS_LABELS = {
  draft: "Rascunho",
  active: "Publicada",
  archived: "Arquivada",
};

export default function CreatorCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCampaigns() {
    setLoading(true);
    setError("");

    try {
      setCampaigns(await listMyCampaigns(filter ? { status: filter } : {}));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar suas campanhas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, [filter]);

  return (
    <div className="creator-page">
      <PageHeader
        eyebrow="Modo Mestre"
        title="Minhas Campanhas"
        description="Crie campanhas solo com capítulos, escolhas, testes, missões reais e relíquias."
        action={
          <Link className="primary-button" to="/minhas-campanhas/nova">
            <Plus size={18} />
            Criar campanha
          </Link>
        }
      />

      <div className="filters">
        {[
          ["", "Todas"],
          ["draft", "Rascunhos"],
          ["active", "Publicadas"],
          ["archived", "Arquivadas"],
        ].map(([value, label]) => (
          <button
            key={label}
            className={filter === value ? "active" : ""}
            type="button"
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando campanhas criadas..." />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha criada ainda."
          description="Crie sua primeira crônica solo e publique quando estiver pronta."
        />
      ) : (
        <section className="creator-campaign-grid">
          {campaigns.map((campaign) => (
            <article className="creator-campaign-card" key={campaign._id}>
              <div className="creator-campaign-icon">
                <BookOpen size={28} />
              </div>

              <div className="creator-campaign-content">
                <span className="eyebrow">
                  {STATUS_LABELS[campaign.status] || campaign.status} ·{" "}
                  {campaign.visibility === "public" ? "Pública" : "Privada"}
                </span>

                <h2>{campaign.title}</h2>

                <p>{campaign.description}</p>

                <div className="creator-meta-row">
                  <span>{campaign.chapters_count || 0} capítulos</span>
                  <span>Nível {campaign.recommended_level || 1}</span>
                  <span>{campaign.theme}</span>
                </div>

                <div className="creator-actions">
                  <Link className="primary-button" to={`/minhas-campanhas/${campaign.slug}/editar`}>
                    <Edit3 size={18} />
                    Editar
                  </Link>

                  {campaign.status === "active" && (
                    <Link className="ghost-button" to={`/campanhas/${campaign.slug}`}>
                      <Sparkles size={18} />
                      Jogar
                    </Link>
                  )}

                  {campaign.status === "archived" && (
                    <span className="status-chip">
                      <Archive size={16} />
                      Arquivada
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
