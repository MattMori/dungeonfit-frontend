import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import WalletSummary from "../components/economy/WalletSummary";
import TransactionList from "../components/economy/TransactionList";

import { listWalletTransactions } from "../services/walletService";

import "../styles/economy.css";

export default function Wallet() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWallet() {
    setLoading(true);
    setError("");

    try {
      setData(await listWalletTransactions());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar carteira.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <div className="economy-page">
      <PageHeader
        eyebrow="Carteira"
        title="Ecos"
        description="Veja saldo, ganhos e gastos da sua jornada."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando carteira..." />
      ) : (
        <>
          <WalletSummary wallet={data?.wallet} />
          <TransactionList transactions={data?.transactions || []} />
        </>
      )}
    </div>
  );
}
