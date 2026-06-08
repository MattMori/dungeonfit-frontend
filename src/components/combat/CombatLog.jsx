import "../../styles/combat.css";

export default function CombatLog({ log = [] }) {
  return (
    <section className="combat-log">
      <span className="eyebrow">Registro</span>
      <h2>Log de combate</h2>

      {log.length ? (
        <div className="combat-log-list">
          {[...log].reverse().map((entry, index) => (
            <article key={`${entry.created_at}-${index}`} className={entry.actor}>
              <span>Rodada {entry.round} · {entry.actor}</span>
              <strong>{entry.message}</strong>
            </article>
          ))}
        </div>
      ) : (
        <p>Nenhuma ação registrada.</p>
      )}
    </section>
  );
}
