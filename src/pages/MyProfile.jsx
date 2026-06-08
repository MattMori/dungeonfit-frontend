import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProfileHero from "../components/profile/ProfileHero";
import ProfileStats from "../components/profile/ProfileStats";
import FeaturedRelics from "../components/profile/FeaturedRelics";
import FeaturedChronicles from "../components/profile/FeaturedChronicles";

import { getMyProfile } from "../services/profileService";

import "../styles/profile.css";

export default function MyProfile() {
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      setBundle(await getMyProfile());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return <Loading text="Abrindo perfil..." />;
  }

  return (
    <div className="profile-page">
      <ErrorMessage message={error} />

      <ProfileHero bundle={bundle} editable />

      <ProfileStats stats={bundle?.stats} />

      <section className="profile-grid">
        <FeaturedRelics relics={bundle?.featured?.relics || []} />
        <FeaturedChronicles chronicles={bundle?.featured?.chronicles || []} />
      </section>
    </div>
  );
}
