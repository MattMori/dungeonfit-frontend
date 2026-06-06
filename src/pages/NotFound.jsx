import { Link } from "react-router-dom";
export default function NotFound(){return <main className="not-found"><span className="eyebrow">404</span><h1>Página perdida na dungeon</h1><p>Essa rota não existe ou foi devorada por um mimic.</p><Link className="primary-button" to="/dashboard">Voltar ao dashboard</Link></main>}
