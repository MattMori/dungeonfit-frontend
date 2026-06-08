import { useEffect, useState } from "react";
import { Coins, ShoppingBag, Wallet } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminTable from "../../components/admin/AdminTable";

import { getAdminEconomy } from "../../services/adminService";

import "../../styles/admin.css";

export default function AdminEconomy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEconomy() {
    setLoading(true);
    setError("");

    try {
      setData(await getAdminEconomy());
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar economia.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEconomy();
  }, []);

  const transactionColumns = [
    {
      key: "user",
      label: "Usuário",
      render: (row) => row.user_id?.nome || row.user_id?.name || row.user_id?.email || "-",
    },
    { key: "type", label: "Tipo" },
    { key: "source", label: "Origem" },
    { key: "amount", label: "Ecos" },
    { key: "description", label: "Descrição" },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Admin"
        title="Economia"
        description="Acompanhe Ecos gerados, gastos, compras e saldos."
      />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading text="Carregando economia..." />
      ) : (
        <>
          <section className="admin-metric-grid">
            <AdminMetricCard
              label="Carteiras"
              value={data?.summary?.wallets}
              icon={<Wallet size={24} />}
            />
            <AdminMetricCard
              label="Ecos em circulação"
              value={data?.summary?.total_balance}
              icon={<Coins size={24} />}
            />
            <AdminMetricCard
              label="Ecos gerados"
              value={data?.summary?.lifetime_earned}
              icon={<Coins size={24} />}
            />
            <AdminMetricCard
              label="Ecos gastos"
              value={data?.summary?.lifetime_spent}
              icon={<ShoppingBag size={24} />}
            />
          </section>

          <section className="admin-panel">
            <span className="eyebrow">Transações recentes</span>
            <h2>Fluxo de Ecos</h2>
            <AdminTable columns={transactionColumns} rows={data?.recent_transactions || []} />
          </section>
        </>
      )}
    </div>
  );
}
