import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Character from "./pages/Character.jsx";
import Activities from "./pages/Activities.jsx";
import ActivityForm from "./pages/ActivityForm.jsx";
import ActivityLogs from "./pages/ActivityLogs.jsx";
import Progress from "./pages/Progress.jsx";
import Rewards from "./pages/Rewards.jsx";
import Ranking from "./pages/Ranking.jsx";
import Profile from "./pages/Profile.jsx";
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
          <Route path="/dashboard" element={<Dashboard />} />

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
          <Route
            path="/progresso"
            element={<Navigate to="/evolucao" replace />}
          />

          <Route path="/reliquias" element={<Rewards />} />
          <Route
            path="/recompensas"
            element={<Navigate to="/reliquias" replace />}
          />

          <Route path="/ranking" element={<Ranking />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
