import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Castle,
  Crown,
  Flame,
  History,
  LogOut,
  Menu,
  ScrollText,
  Shield,
  Skull,
  Sparkles,
  Trophy,
  User,
  X,
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
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMenuOpen);

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMenuOpen]);

  return (
    <div className="app-shell dungeon-shell">
      <button
        className="mobile-menu-button"
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      <div
        className={`sidebar-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <div className="brand">
            <div className="brand-mark">
              <Skull size={23} />
            </div>

            <div>
              <strong>DungeonFit</strong>
              <span>Grimório de progressão</span>
            </div>
          </div>

          <button
            className="mobile-menu-close"
            type="button"
            onClick={closeMenu}
            aria-label="Fechar menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="desktop-brand">
          <div className="brand">
            <div className="brand-mark">
              <Skull size={23} />
            </div>

            <div>
              <strong>DungeonFit</strong>
              <span>Grimório de progressão</span>
            </div>
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
