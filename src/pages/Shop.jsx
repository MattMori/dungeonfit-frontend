import { useEffect, useMemo, useState } from "react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import WalletSummary from "../components/economy/WalletSummary";
import ShopItemCard from "../components/economy/ShopItemCard";

import { getWallet } from "../services/walletService";
import { buyShopItem, listShopItems } from "../services/shopService";

import "../styles/economy.css";

export default function Shop() {
  const [wallet, setWallet] = useState(null);
  const [items, setItems] = useState([]);
  const [activeType, setActiveType] = useState("");
  const [buyingSlug, setBuyingSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const params = useMemo(() => {
    if (!activeType) return {};
    return { type: activeType };
  }, [activeType]);

  async function loadShop() {
    setLoading(true);
    setError("");

    try {
      const [walletResponse, itemsResponse] = await Promise.all([
        getWallet(),
        listShopItems(params),
      ]);

      setWallet(walletResponse);
      setItems(itemsResponse);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar loja.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShop();
  }, [params]);

  async function handleBuy(slug) {
    setBuyingSlug(slug);
    setError("");
    setSuccess("");

    try {
      await buyShopItem(slug, 1);
      setSuccess("Compra realizada. Item enviado para inventário/relíquias.");
      await loadShop();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao comprar item.");
    } finally {
      setBuyingSlug("");
    }
  }

  return (
    <div className="economy-page">
      <PageHeader
        eyebrow="Loja"
        title="Mercado dos Ecos"
        description="Gaste Ecos em consumíveis, relíquias e itens cosméticos."
      />

      <ErrorMessage message={error} />
      {success && <div className="success-message">{success}</div>}

      {loading ? (
        <Loading text="Abrindo mercado..." />
      ) : (
        <>
          <WalletSummary wallet={wallet} />

          <div className="shop-tabs">
            {[
              ["", "Tudo"],
              ["consumable", "Consumíveis"],
              ["equipment", "Equipamentos"],
              ["relic", "Relíquias"],
              ["cosmetic", "Cosméticos"],
            ].map(([value, label]) => (
              <button
                key={label}
                className={activeType === value ? "active" : ""}
                type="button"
                onClick={() => setActiveType(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <EmptyState
              title="Nenhum item disponível."
              description="Rode o seed da loja para popular o mercado."
            />
          ) : (
            <section className="shop-grid">
              {items.map((item) => (
                <ShopItemCard
                  key={item._id}
                  item={item}
                  buying={buyingSlug === item.slug}
                  onBuy={handleBuy}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
