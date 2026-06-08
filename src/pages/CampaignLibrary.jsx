import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookOpen, Compass, Sparkles } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import CampaignLibraryCard from "../components/library/CampaignLibraryCard";
import CampaignFilters from "../components/library/CampaignFilters";

import {
  listLibraryCampaigns,
  saveLibraryCampaign,
  unsaveLibraryCampaign,
} from "../services/libraryService";

import "../styles/library.css";

export default function CampaignLibrary() {
  const [campaigns, setCampaigns] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    theme: "",
    tag: "",
    official: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState("");
  const [error, setError] = useState("");

  const queryParams = useMemo(() => {
    const params = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") params[key] = value;
    });

    if (activeTab === "official") params.official = "true";
    if (activeTab === "community") params.official = "false";
    if (activeTab === "mine") params.created_by = "me";

    return params;
  }, [filters, activeTab]);

  async function loadCampaigns() {
    setLoading(true);
    setError("");

    try {
      setCampaigns(await listLibraryCampaigns(queryParams));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar biblioteca.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, [queryParams]);

  async function handleToggleSave(campaign) {
    setSavingSlug(campaign.slug);
    setError("");

    try {
      if (campaign.saved) {
        await unsaveLibraryCampaign(campaign.slug);
      } else {
        await saveLibraryCampaign(campaign.slug);
      }

      await loadCampaigns();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar campanha salva.");
    } finally {
      setSavingSlug("");
    }
  }

  function clearFilters() {
    setFilters({
      search: "",
      theme: "",
      tag: "",
      official: "",
    });
  }

  return (
    <div className="library-page">
      <PageHeader
        eyebrow="Biblioteca"
        title="Campanhas para jogar"
        description="Descubra campanhas oficiais, crônicas da comunidade e aventuras criadas por você."
      />

      <section className="library-hero-panel">
        <div>
          <span className="eyebrow">Descoberta</span>
          <h2>Escolha uma crônica. O Cronarium registra a jornada.</h2>
          <p>
            Salve campanhas para depois, continue histórias em andamento ou
            explore novas aventuras solo movidas por ações reais.
          </p>
        </div>

        <div className="library-hero-icons">
          <Compass size={24} />
          <BookOpen size={24} />
          <Sparkles size={24} />
        </div>
      </section>

      <div className="library-tabs">
        {[
          ["all", "Todas"],
          ["official", "Oficiais"],
          ["community", "Comunidade"],
          ["mine", "Criadas por mim"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={activeTab === value ? "active" : ""}
            type="button"
            onClick={() => setActiveTab(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <CampaignFilters filters={filters} onChange={setFilters} onClear={clearFilters} />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Buscando campanhas..." />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha encontrada."
          description="Ajuste os filtros ou publique uma campanha pelo Modo Mestre."
        />
      ) : (
        <section className="library-grid">
          {campaigns.map((campaign) => (
            <CampaignLibraryCard
              key={campaign._id}
              campaign={campaign}
              saving={savingSlug === campaign.slug}
              onToggleSave={handleToggleSave}
            />
          ))}
        </section>
      )}

      <section className="saved-callout">
        <Bookmark size={22} />
        <div>
          <strong>Quer guardar aventuras para depois?</strong>
          <span>Use o ícone de salvar nos cards e acesse a lista em campanhas salvas.</span>
        </div>
      </section>
    </div>
  );
}
