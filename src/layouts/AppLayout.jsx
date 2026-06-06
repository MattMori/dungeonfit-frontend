import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Castle,
  Crown,
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Salão da Guilda", icon: Castle },
  { to: "/personagem", label: "Ficha do Herói", icon: Shield },
  { to: "/atividades", label: "Missões", icon: ScrollText },
  { to: "/historico", label: "Crônicas", icon: History },
  { to: "/progresso", label: "Evolução", icon: Flame },
  { to: "/recompensas", label: "Relíquias", icon: Sparkles },
  { to: "/ranking", label: "Hall dos Heróis", icon: Trophy },
  { to: "/perfil", label: "Conta", icon: User },
];

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell dungeon-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Skull size={23} />
          </div>

          <div>
            <strong>DungeonFit</strong>
            <span>Grimório de progressão</span>
          </div>
        </div>

        <div className="sidebar-scroll">
          <BookOpen size={17} />
          <span>A campanha continua.</span>
        </div>

        <nav className="nav-list">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="nav-item">
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Sair da taverna
        </button>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <span className="eyebrow">Campanha ativa</span>
            <strong>DungeonFit: Crônicas do Corpo Real</strong>
          </div>

          <div className="user-pill">
            <Crown size={16} />
            <span>{user?.username || user?.name || "Aventureiro"}</span>
          </div>
        </header>

        <section className="page-container">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
