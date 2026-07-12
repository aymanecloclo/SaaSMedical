import { Link, useNavigate } from "react-router-dom";
import { Stethoscope, LogOut } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Stethoscope size={24} />
          <span className="text-xl font-bold">TabibPlus</span>
        </Link>

        {/* Actions à droite */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.nom}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}