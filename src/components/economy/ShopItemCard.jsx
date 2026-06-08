import { Gem, Package, Sparkles } from "lucide-react";

import "../../styles/economy.css";

export default function ShopItemCard({ item, buying, onBuy }) {
  return (
    <article className={`shop-item-card ${item.rarity}`}>
      <div className="shop-item-icon">
        {item.type === "relic" || item.type === "cosmetic" ? (
          <Sparkles size={24} />
        ) : (
          <Package size={24} />
        )}
      </div>

      <div>
        <span className="eyebrow">
          {item.type} · {item.rarity}
        </span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>

        <div className="shop-price">
          <Gem size={16} />
          {item.price} Ecos
        </div>

        <button className="primary-button" type="button" disabled={buying} onClick={() => onBuy(item.slug)}>
          {buying ? "Comprando..." : "Comprar"}
        </button>
      </div>
    </article>
  );
}
