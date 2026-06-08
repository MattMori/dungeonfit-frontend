import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import CampaignLibraryCard from "../components/library/CampaignLibraryCard";

import {
  listSavedCampaigns,
  saveLibraryCampaign,
  unsaveLibraryCampaign,
} from "../services/libraryService";

import "../styles/library.css";

export default function SavedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState("");
  const [error, setError] = useState("");

  async function loadCampaigns() {
    setLoading(true);
    setError("");

    try {
      setCampaigns(await listSavedCampaigns());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar campanhas salvas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

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

  return (
    <div className="library-page">
      <PageHeader
        eyebrow="Biblioteca"
        title="Campanhas Salvas"
        description="Aventuras guardadas para jogar depois."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando campanhas salvas..." />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha salva."
          description="Explore a biblioteca e salve campanhas interessantes para jogar depois."
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
          <strong>Campanhas salvas não iniciam progresso automaticamente.</strong>
          <span>Abra os detalhes da campanha quando quiser começar.</span>
        </div>
      </section>
    </div>
  );
}
