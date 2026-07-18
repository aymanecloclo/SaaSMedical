import { useNavigate } from "react-router-dom";
import { User, Stethoscope, ArrowRight } from "lucide-react";
import { Card } from "../../../components/ui/Card";

export function RegisterChoicePage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl [animation-delay:1s]" />

      <div className="relative w-full max-w-2xl animate-fadeIn">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Créer un compte</h1>
          <p className="mt-2 text-gray-500">Choisissez votre type de compte</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Carte Patient */}
          <button
            onClick={() => navigate("/register/patient")}
            className="group text-left"
          >
            <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
                <User size={28} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Je suis patient</h2>
              <p className="mt-1 text-sm text-gray-500">
                Prendre rendez-vous avec un médecin en ligne
              </p>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                Continuer <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </button>

          {/* Carte Professionnel */}
          <button
            onClick={() => navigate("/register/professionnel")}
            className="group text-left"
          >
            <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <Stethoscope size={28} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Je suis praticien</h2>
              <p className="mt-1 text-sm text-gray-500">
                Gérer mon cabinet et mes rendez-vous
              </p>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-emerald-600">
                Continuer <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}