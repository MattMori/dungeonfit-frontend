import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileStats from "../components/profile/ProfileStats";
import FeaturedRelics from "../components/profile/FeaturedRelics";
import FeaturedChronicles from "../components/profile/FeaturedChronicles";

import { getPublicProfile } from "../services/profileService";

import "../styles/profile.css";

export default function PublicProfile() {
  const { username } = useParams();

  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      setBundle(await getPublicProfile(username));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar perfil público.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [username]);

  if (loading) {
    return <Loading text="Buscando aventureiro..." />;
  }

  if (!bundle) {
    return (
      <div className="profile-page">
        <ErrorMessage message={error} />
        <EmptyState
          title="Perfil não encontrado."
          description="Esse aventureiro pode ter se perdido nos corredores do Cronarium."
        />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <ErrorMessage message={error} />

      <ProfileHero bundle={bundle} />

      {bundle.stats && <ProfileStats stats={bundle.stats} />}

      <section className="profile-grid">
        <FeaturedRelics relics={bundle?.featured?.relics || []} />
        <FeaturedChronicles chronicles={bundle?.featured?.chronicles || []} />
      </section>
    </div>
  );
}
