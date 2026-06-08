import { Gem } from "lucide-react";

import "../../styles/economy.css";

export default function WalletSummary({ wallet }) {
  return (
    <section className="wallet-summary">
      <div>
        <span className="eyebrow">Carteira</span>
        <h2>{wallet?.balance || 0} Ecos</h2>
        <p>
          Ecos são ganhos ao concluir missões, vencer combates e finalizar
          campanhas.
        </p>
      </div>

      <Gem size={42} />

      <div className="wallet-stat-row">
        <span>
          <strong>{wallet?.lifetime_earned || 0}</strong>
          ganhos
        </span>
        <span>
          <strong>{wallet?.lifetime_spent || 0}</strong>
          gastos
        </span>
      </div>
    </section>
  );
}
