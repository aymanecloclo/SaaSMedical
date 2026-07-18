import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { PraticienDashboardPage } from "./PraticienDashboardPage";

export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (user?.role === "Praticien" || user?.role === "Admin") {
    return <PraticienDashboardPage />;
  }

  if (user?.role === "Patient") {
    // Dashboard patient pas encore construit — redirection temporaire
    return <Navigate to="/" replace />;
  }

  if (user?.role === "Secretaire") {
    // Dashboard secrétaire pas encore construit — redirection temporaire
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/" replace />;
}
