import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/Login";
import { Home } from "../pages/Home";
import Users from "@/pages/users";
import Projects from "@/pages/projects";
import MyTeams from "@/pages/myTeams";
import { Teams } from "@/pages/Teams";
import MyProjects from "@/pages/myProjects";
import { PrivateRoute } from "./privateRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública para login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas protegidas */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
        }
      />
      <Route
        path="/myTeams"
        element={
          <PrivateRoute>
            <MyTeams />
          </PrivateRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        }
      />
      <Route
        path="/myProjects"
        element={
          <PrivateRoute>
            <MyProjects />
          </PrivateRoute>
        }
      />

      {/* Redireciona para login por padrão */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;