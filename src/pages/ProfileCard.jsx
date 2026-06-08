import { useEffect, useState } from "react";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ShareableProfileCard from "../components/profile/ShareableProfileCard";

import { getMyProfile, getProfileCard } from "../services/profileService";

import "../styles/profile.css";

export default function ProfileCard() {
  const [card, setCard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCard() {
    setLoading(true);
    setError("");

    try {
      const bundle = await getMyProfile();
      setCard(await getProfileCard(bundle.profile.username));
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar card.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCard();
  }, []);

  if (loading) {
    return <Loading text="Forjando card..." />;
  }

  return (
    <div className="profile-page">
      <ErrorMessage message={error} />

      <section className="profile-settings-hero">
        <div>
          <span className="eyebrow">Card</span>
          <h1>Card compartilhável</h1>
          <p>Por enquanto é HTML bonito. PNG vem depois, sem pressa de inventar impressora arcana.</p>
        </div>
      </section>

      <ShareableProfileCard card={card} />
    </div>
  );
}
