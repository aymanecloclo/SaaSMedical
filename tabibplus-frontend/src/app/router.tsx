import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { Layout } from "../components/layout/Layout";
import { RegisterChoicePage } from "../features/auth/pages/RegisterChoicePage";
import { RegisterPatientPage } from "../features/auth/pages/RegisterPatientPage";
import { RegisterProfessionnelPage } from "../features/auth/pages/RegisterProfessionnelPage";
import { MonProfilPage } from "../features/patient-dashboard/pages/MonProfilPage";
import { PraticienProfilePage } from "../features/praticiens/pages/PraticienProfilePage";
import { SearchPage } from "../features/praticiens/pages/SearchPage";
import { RoleBasedDashboard } from "../features/dashboard/pages/RoleBasedDashboard";
import { ReservationPage } from "../features/rendezvous/pages/ReservationPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <SearchPage />
      </Layout>
    ),
  },
  {
    path: "/praticiens/:id/reserver",
    element: (
      <ProtectedRoute>
        <Layout>
          <ReservationPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profil",
    element: (
      <ProtectedRoute>
        <Layout>
          <MonProfilPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <RoleBasedDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/praticiens/:id",
    element: (
      <Layout>
        <PraticienProfilePage />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: <RegisterChoicePage />,
  },
  {
    path: "/register/patient",
    element: <RegisterPatientPage />,
  },
  {
    path: "/praticiens/:id",
    element: (
      <Layout>
        <div>Profil praticien public</div>
      </Layout>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: (
      <Layout>
        <div>Inscription</div>
      </Layout>
    ),
  },

  {
    path: "*",
    element: (
      <Layout>
        <div className="text-red-600">404 — Page introuvable</div>
      </Layout>
    ),
  },
  {
    path: "/register/professionnel",
    element: <RegisterProfessionnelPage />,
  },
]);