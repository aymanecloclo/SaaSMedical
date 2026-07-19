import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Calendar, ArrowLeft, Video, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { usePraticien } from "../../praticiens/hooks/usePraticien";
import { useDisponibilites, useCreateRendezVous } from "../hooks/useRendezVous";
import { useAuth } from "../../auth/AuthContext";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { getImageUrl } from "../../../lib/getImageUrl";

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getProchainsJours(nb: number): Date[] {
  const jours: Date[] = [];
  for (let i = 0; i < nb; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    jours.push(d);
  }
  return jours;
}

export function ReservationPage() {
  const { id } = useParams<{ id: string }>();
  const praticienId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dateSelectionnee, setDateSelectionnee] = useState(
    formatDateInput(new Date())
  );
  const [creneauSelectionne, setCreneauSelectionne] = useState<string | null>(null);
  const [motif, setMotif] = useState("");
  const [teleconsultation, setTeleconsultation] = useState(false);

  const { data: praticien, isLoading: praticienLoading } = usePraticien(praticienId);
  const { data: disponibilites, isLoading: dispoLoading } = useDisponibilites(
    praticienId,
    dateSelectionnee
  );
  const createMutation = useCreateRendezVous();

  const jours = getProchainsJours(14);

  const handleConfirmer = () => {
    if (!creneauSelectionne) {
      toast.error("Choisis un créneau horaire");
      return;
    }
    if (!motif.trim()) {
      toast.error("Indique le motif de la consultation");
      return;
    }
    if (!user?.patientId) {
      toast.error("Vous devez être connecté avec un compte patient");
      return;
    }
    if (!praticien) return;

    createMutation.mutate(
      {
        patientId: user.patientId,
        praticienId,
        cabinetId: praticien.cabinetId,
        dateHeure: creneauSelectionne,
        dureeMinutes: 30,
        motif: motif.trim(),
        estTeleconsultation: teleconsultation,
        source: "EnLigne",
      },
      {
        onSuccess: () => {
          toast.success("Rendez-vous confirmé !");
          navigate("/dashboard");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ?? "Erreur lors de la réservation";
          toast.error(msg);
        },
      },
    );
  };

  if (praticienLoading) {
    return (
      <div className="flex justify-center py-20 text-primary">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!praticien) {
    return (
      <div className="py-20 text-center text-gray-500">
        Praticien introuvable.
      </div>
    );
  }

  const avatar = getImageUrl(praticien.photoProfil) || "/images/default-doctor.jpg";

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft size={16} /> Retour au profil
      </button>

      {/* En-tête praticien */}
      <Card className="mb-6 flex items-center gap-4">
        <img
          src={avatar}
          alt={praticien.nomComplet}
          className="h-16 w-16 rounded-2xl object-cover"
        />
        <div>
          <h1 className="text-lg font-bold text-gray-900">{praticien.nomComplet}</h1>
          <p className="text-sm text-primary">{praticien.specialite}</p>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={14} /> {praticien.ville}
          </p>
        </div>
      </Card>

      {/* Choix de la date */}
      <Card className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
          <Calendar size={18} /> Choisir une date
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {jours.map((jour) => {
            const iso = formatDateInput(jour);
            const isSelected = iso === dateSelectionnee;
            return (
              <button
                key={iso}
                onClick={() => {
                  setDateSelectionnee(iso);
                  setCreneauSelectionne(null);
                }}
                className={`flex flex-shrink-0 flex-col items-center rounded-2xl px-4 py-3 text-sm transition ${
                  isSelected
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-xs opacity-80">
                  {jour.toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
                <span className="font-bold">{jour.getDate()}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Créneaux horaires */}
      <Card className="mb-6">
        <h2 className="mb-4 font-semibold text-gray-900">Créneaux disponibles</h2>

        {dispoLoading && (
          <div className="flex justify-center py-8 text-primary">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {!dispoLoading && disponibilites?.length === 0 && (
          <p className="py-8 text-center text-gray-400">
            Aucun créneau disponible ce jour-là.
          </p>
        )}

        {!dispoLoading && disponibilites && disponibilites.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {disponibilites.map((creneau) => (
              <button
                key={creneau.dateHeure}
                disabled={!creneau.libre}
                onClick={() => setCreneauSelectionne(creneau.dateHeure)}
                className={`rounded-xl py-2.5 text-sm font-medium transition ${
                  !creneau.libre
                    ? "cursor-not-allowed bg-gray-50 text-gray-300 line-through"
                    : creneauSelectionne === creneau.dateHeure
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {creneau.heure}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Motif + téléconsultation */}
      <Card className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Motif de la consultation
        </label>
        <textarea
          rows={3}
          value={motif}
          onChange={(e) => setMotif(e.target.value)}
          placeholder="Ex : douleurs abdominales depuis 2 jours..."
          className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
        />

        {praticien.accepteTeleconsult && (
          <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={teleconsultation}
              onChange={(e) => setTeleconsultation(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Video size={16} className="text-cyan-600" />
            Je préfère une téléconsultation
          </label>
        )}
      </Card>

      <Button
        onClick={handleConfirmer}
        isLoading={createMutation.isPending}
        disabled={!creneauSelectionne}
      >
        Confirmer le rendez-vous
      </Button>
    </div>
  );
}
