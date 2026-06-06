import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
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
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personagem" element={<Character />} />
        <Route path="/atividades" element={<Activities />} />
        <Route path="/atividades/nova" element={<ActivityForm />} />
        <Route path="/historico" element={<ActivityLogs />} />
        <Route path="/progresso" element={<Progress />} />
        <Route path="/recompensas" element={<Rewards />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
