import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { PraticienDashboardPage } from "./PraticienDashboardPage";
import { PatientDashboardPage } from "../../patient-dashboard/pages/PatientDashboardPage";
import { SecretaireDashboardPage } from "../../secretaire-dashboard/pages/SecretaireDashboardPage";

export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (user?.role === "Praticien" || user?.role === "Admin") {
    return <PraticienDashboardPage />;
  }

  if (user?.role === "Patient") {
    return <PatientDashboardPage />;
  }

  if (user?.role === "Secretaire") {
    return <SecretaireDashboardPage />;
  }

  return <Navigate to="/" replace />;
}
