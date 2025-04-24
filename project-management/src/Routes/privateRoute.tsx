import { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem("token");

  // Se o token não existir, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Caso contrário, renderiza o componente filho
  return children;
}