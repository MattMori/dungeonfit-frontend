import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Bookmark,
  Castle,
  Coins,
  Crown,
  Flame,
  History,
  LogOut,
  Menu,
  Package,
  ScrollText,
  Shield,
  ShoppingBag,
  Skull,
  Sparkles,
  Trophy,
  User,
  WandSparkles,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const menuGroups = [
  {
    title: "Jornada",
    items: [
      {
        label: "A Taverna",
        path: "/taverna",
        icon: BookOpen,
      },
      {
        label: "Primeira Jornada",
        path: "/primeira-jornada",
        icon: Sparkles,
      },
      {
        label: "Rotina",
        path: "/rotina",
        icon: Flame,
      },
      {
        label: "Boss Semanal",
        path: "/boss-semanal",
        icon: Skull,
      },
    ],
  },
  {
    title: "Campanhas",
    items: [
      {
        label: "Campanhas",
        path: "/campanhas",
        icon: BookOpen,
      },
      {
        label: "Salvas",
        path: "/campanhas/salvas",
        icon: Bookmark,
      },
      {
        label: "Modo Mestre",
        path: "/minhas-campanhas",
        icon: Crown,
      },
      {
        label: "Missões Reais",
        path: "/missoes",
        icon: ScrollText,
      },
      {
        label: "Crônicas",
        path: "/cronicas",
        icon: History,
      },
    ],
  },
  {
    title: "Personagem",
    items: [
      {
        label: "Ficha",
        path: "/personagem",
        icon: Shield,
      },
      {
        label: "Inventário",
        path: "/inventario",
        icon: Package,
      },
      {
        label: "Loja",
        path: "/loja",
        icon: ShoppingBag,
      },
      {
        label: "Carteira",
        path: "/carteira",
        icon: Coins,
      },
      {
        label: "Grimório",
        path: "/grimorio",
        icon: WandSparkles,
      },
      {
        label: "Relíquias",
        path: "/reliquias",
        icon: Sparkles,
      },
      {
        label: "Evolução",
        path: "/evolucao",
        icon: Flame,
      },
    ],
  },
  {
    title: "Social",
    items: [
      {
        label: "Meu Perfil",
        path: "/meu-perfil",
        icon: User,
      },
      {
        label: "Guildas",
        path: "/guildas",
        icon: Castle,
      },
      {
        label: "Ranking",
        path: "/ranking",
        icon: Trophy,
      },
      {
        label: "Notificações",
        path: "/notificacoes",
        icon: Bell,
      },
      {
        label: "Conta",
        path: "/conta",
        icon: User,
      },
    ],
  },
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
              <strong>Cronarium</strong>
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
              <strong>Cronarium</strong>
              <span>Grimório de progressão</span>
            </div>
          </div>
        </div>

        <div className="sidebar-scroll">
          <BookOpen size={17} />
          <span>A campanha continua.</span>
        </div>

        <nav className="nav-list grouped-nav-list">
          {menuGroups.map((group) => (
            <div className="nav-group" key={group.title}>
              <span className="nav-group-title">{group.title}</span>

              <div className="nav-group-items">
                {group.items.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) =>
                      isActive ? "nav-item active" : "nav-item"
                    }
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <button className="logout-button" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          Sair da taverna
        </button>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <span className="eyebrow">Campanha ativa</span>
            <strong>Cronarium: Crônicas do Corpo Real</strong>
          </div>

          <div className="user-pill">
            <Crown size={16} />
            <span>
              {user?.username || user?.name || user?.nome || "Aventureiro"}
            </span>
          </div>
        </header>

        <section className="page-container">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
