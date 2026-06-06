export default function EmptyState({ title = "Nada por aqui ainda.", description }) { return <div className="empty-state"><strong>{title}</strong>{description && <p>{description}</p>}</div>; }
