import { useState } from "react";
import {
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Video,
  XCircle,
  User as UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMesRendezVous, useAnnulerRendezVous } from "../hooks/usePatientDashboard";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { getImageUrl } from "../../../lib/getImageUrl";
import {
  STATUT_LABELS_PATIENT,
  STATUT_COULEURS_PATIENT,
} from "../types";

export function PatientDashboardPage() {
  const [onglet, setOnglet] = useState<"avenir" | "historique">("avenir");
  const { data: rdvs, isLoading } = useMesRendezVous(onglet === "avenir");
  const annulerMutation = useAnnulerRendezVous();

  const handleAnnuler = (id: number) => {
    if (confirm("Confirmer l'annulation de ce rendez-vous ?")) {
      annulerMutation.mutate(id);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h1>
        <Link to="/profil">
          <Button variant="outline" className="w-auto px-4">
            <UserIcon size={16} /> Mon profil
          </Button>
        </Link>
      </div>

      {/* Onglets */}
      <div className="mb-6 flex gap-2 rounded-2xl bg-gray-100 p-1">
        <button
          onClick={() => setOnglet("avenir")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
            onglet === "avenir"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          À venir
        </button>
        <button
          onClick={() => setOnglet("historique")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
            onglet === "historique"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Historique
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16 text-primary">
          <Loader2 className="animate-spin" size={28} />
        </div>
      )}

      {!isLoading && rdvs?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
          {onglet === "avenir"
            ? "Aucun rendez-vous à venir."
            : "Aucun rendez-vous dans l'historique."}
        </div>
      )}

      {!isLoading && rdvs && rdvs.length > 0 && (
        <div className="space-y-4">
          {rdvs.map((rdv) => {
            const avatar =
              getImageUrl(rdv.praticienPhoto) || "/images/default-doctor.jpg";
            const date = new Date(rdv.dateHeure);

            return (
              <Card key={rdv.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={avatar}
                  alt={rdv.praticienNomComplet}
                  className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {rdv.praticienNomComplet}
                  </p>
                  <p className="text-sm text-primary">{rdv.specialite}</p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {rdv.ville}
                    </span>
                    {rdv.estTeleconsultation && (
                      <span className="flex items-center gap-1 text-cyan-600">
                        <Video size={14} /> Téléconsultation
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUT_COULEURS_PATIENT[rdv.statut] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUT_LABELS_PATIENT[rdv.statut] ?? rdv.statut}
                  </span>

                  {onglet === "avenir" &&
                    rdv.statut !== "Annule" &&
                    rdv.statut !== "Termine" && (
                      <button
                        onClick={() => handleAnnuler(rdv.id)}
                        disabled={annulerMutation.isPending}
                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                      >
                        <XCircle size={14} /> Annuler
                      </button>
                    )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
