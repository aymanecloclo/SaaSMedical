import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  LogOut,
  LayoutDashboard,
  User,
  Bell,
  Menu,
} from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* ================= LOGO ================= */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-all duration-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-lg transition group-hover:scale-105">
            <Stethoscope size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              TabibPlus
            </h1>

            <p className="text-xs text-gray-500">
              Plateforme Médicale
            </p>
          </div>
        </Link>

        {/* ================= MENU ================= */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-gray-600 hover:text-primary"
              }`
            }
          >
            Accueil
          </NavLink>

          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-gray-600 hover:text-primary"
              }`
            }
          >
            Médecins
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-gray-600 hover:text-primary"
              }`
            }
          >
            Rendez-vous
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition ${
                isActive
                  ? "font-semibold text-primary"
                  : "text-gray-600 hover:text-primary"
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* ================= ACTIONS ================= */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notification */}
              <button className="relative rounded-xl p-2 text-gray-600 transition hover:bg-gray-100">
                <Bell size={20} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="hidden rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:block"
              >
                <LayoutDashboard size={20} />
              </Link>

              {/* Profil */}
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                  <User size={18} />
                </div>

                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.nom}
                  </p>

                  <p className="text-xs text-gray-500">
                    Connecté
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-red-600 transition-all duration-300 hover:bg-red-50 hover:shadow-md"
              >
                <LogOut size={18} />
                <span className="hidden lg:block">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Connexion
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-700 px-5 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                S'inscrire
              </Link>
            </>
          )}

          {/* Mobile */}
          <button className="rounded-xl p-2 transition hover:bg-gray-100 md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}