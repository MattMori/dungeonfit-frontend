import "../../styles/economy.css";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TransactionList({ transactions = [] }) {
  return (
    <section className="transaction-panel">
      <span className="eyebrow">Histórico</span>
      <h2>Transações</h2>

      {transactions.length ? (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <article key={transaction._id} className={transaction.type}>
              <div>
                <strong>
                  {transaction.type === "spend" ? "-" : "+"}
                  {transaction.amount} Ecos
                </strong>
                <span>{transaction.description || transaction.source}</span>
              </div>

              <small>{formatDate(transaction.createdAt)}</small>
            </article>
          ))}
        </div>
      ) : (
        <p>Nenhuma transação registrada ainda.</p>
      )}
    </section>
  );
}
