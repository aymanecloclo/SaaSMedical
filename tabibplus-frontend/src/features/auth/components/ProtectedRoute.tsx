import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Pas connecté → redirigé au login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}