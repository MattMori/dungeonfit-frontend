import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Character from "./pages/Character.jsx";
import Activities from "./pages/Activities.jsx";
import ActivityForm from "./pages/ActivityForm.jsx";
import ActivityLogs from "./pages/ActivityLogs.jsx";
import Progress from "./pages/Progress.jsx";
import Rewards from "./pages/Rewards.jsx";
import Ranking from "./pages/Ranking.jsx";
import Profile from "./pages/Profile.jsx";

import Tavern from "./pages/Tavern";
import CampaignChapter from "./pages/CampaignChapter";
import CampaignDetail from "./pages/CampaignDetail";
import RelicDetail from "./pages/RelicDetail";
import LevelUpPage from "./pages/LevelUpPage";

import Guilds from "./pages/Guilds";
import GuildDetail from "./pages/GuildDetail";

import CampaignLibrary from "./pages/CampaignLibrary";
import SavedCampaigns from "./pages/SavedCampaigns";

import CreatorCampaigns from "./pages/CreatorCampaigns";
import CreatorCampaignNew from "./pages/CreatorCampaignNew";
import CreatorCampaignEdit from "./pages/CreatorCampaignEdit";
import CreatorChapterEdit from "./pages/CreatorChapterEdit";

import Spellbook from "./pages/Spellbook";
import CombatArena from "./pages/CombatArena";
import EncounterEditor from "./pages/EncounterEditor";
import Inventory from "./pages/Inventory";

import Shop from "./pages/Shop";
import Wallet from "./pages/Wallet";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminReports from "./pages/admin/AdminReports";
import AdminShop from "./pages/admin/AdminShop";
import AdminEnemies from "./pages/admin/AdminEnemies";
import AdminEconomy from "./pages/admin/AdminEconomy";

import CreatorCampaignMetrics from "./pages/creator/CreatorCampaignMetrics";

import Notifications from "./pages/Notifications";
import Routine from "./pages/Routine";
import WeeklyBoss from "./pages/WeeklyBoss";

import Onboarding from "./pages/Onboarding";
import FirstJourney from "./pages/FirstJourney";

import MyProfile from "./pages/MyProfile";
import PublicProfile from "./pages/PublicProfile";
import ProfileSettings from "./pages/ProfileSettings";
import ProfileCard from "./pages/ProfileCard";

import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<Navigate to="/taverna" replace />}
          />

          <Route path="/taverna" element={<Tavern />} />

          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/primeira-jornada" element={<FirstJourney />} />

          <Route path="/personagem" element={<Character />} />

          <Route path="/missoes" element={<Activities />} />
          <Route
            path="/atividades"
            element={<Navigate to="/missoes" replace />}
          />
          <Route path="/atividades/nova" element={<ActivityForm />} />

          <Route path="/cronicas" element={<ActivityLogs />} />
          <Route
            path="/historico"
            element={<Navigate to="/cronicas" replace />}
          />

          <Route path="/evolucao" element={<Progress />} />
          <Route path="/evolucao/level-up" element={<LevelUpPage />} />
          <Route
            path="/progresso"
            element={<Navigate to="/evolucao" replace />}
          />

          <Route path="/reliquias" element={<Rewards />} />
          <Route path="/reliquias/:id" element={<RelicDetail />} />
          <Route
            path="/recompensas"
            element={<Navigate to="/reliquias" replace />}
          />

          <Route path="/ranking" element={<Ranking />} />

          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/:username" element={<PublicProfile />} />
          <Route path="/meu-perfil" element={<MyProfile />} />
          <Route path="/meu-perfil/config" element={<ProfileSettings />} />
          <Route path="/perfil/card" element={<ProfileCard />} />
          <Route path="/conta" element={<ProfileSettings />} />

          <Route path="/guildas" element={<Guilds />} />
          <Route path="/guildas/:slug" element={<GuildDetail />} />

          <Route path="/campanhas" element={<CampaignLibrary />} />
          <Route path="/campanhas/salvas" element={<SavedCampaigns />} />
          <Route path="/campanhas/:slug" element={<CampaignChapter />} />
          <Route
            path="/campanhas/:slug/detalhes"
            element={<CampaignDetail />}
          />

          <Route path="/minhas-campanhas" element={<CreatorCampaigns />} />
          <Route
            path="/minhas-campanhas/nova"
            element={<CreatorCampaignNew />}
          />
          <Route
            path="/minhas-campanhas/:slug/editar"
            element={<CreatorCampaignEdit />}
          />
          <Route
            path="/minhas-campanhas/:slug/capitulos/:chapterId"
            element={<CreatorChapterEdit />}
          />
          <Route
            path="/minhas-campanhas/:slug/capitulos/:chapterId/encontros"
            element={<EncounterEditor />}
          />
          <Route
            path="/minhas-campanhas/:slug/metricas"
            element={<CreatorCampaignMetrics />}
          />
          <Route path="/grimorio" element={<Spellbook />} />
          <Route path="/combate/:sessionId" element={<CombatArena />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/loja" element={<Shop />} />
          <Route path="/carteira" element={<Wallet />} />
          <Route path="/rotina" element={<Routine />} />
          <Route path="/boss-semanal" element={<WeeklyBoss />} />
          <Route path="/notificacoes" element={<Notifications />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/campanhas" element={<AdminCampaigns />} />
          <Route path="/admin/denuncias" element={<AdminReports />} />
          <Route path="/admin/loja" element={<AdminShop />} />
          <Route path="/admin/inimigos" element={<AdminEnemies />} />
          <Route path="/admin/economia" element={<AdminEconomy />} />
          <Route path="/404" element={<NotFound />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
