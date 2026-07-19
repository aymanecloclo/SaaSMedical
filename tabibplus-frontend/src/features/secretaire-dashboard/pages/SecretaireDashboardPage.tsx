import { useState } from "react";
import {
  Loader2,
  Calendar,
  Phone,
  AlertCircle,
  Briefcase,
  Star,
  Video,
  CheckCircle,
  CalendarPlus,
} from "lucide-react";

import { NouveauRendezVousModal } from "../components/NouveauRendezVousModal";
import {
  usePraticiensDuCabinet,
  useAgendaPraticien,
} from "../hooks/useSecretaireDashboard";
import { Card } from "../../../components/ui/Card";
import { getImageUrl } from "../../../lib/getImageUrl";

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function SecretaireDashboardPage() {
  const [praticienId, setPraticienId] = useState<number | null>(null);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [modalRdvOuvert, setModalRdvOuvert] = useState(false);

  const { data: praticiens, isLoading: praticiensLoading } =
    usePraticiensDuCabinet();
  const { data: agenda, isLoading: agendaLoading } = useAgendaPraticien(
    praticienId ?? 0,
    date,
  );

  const praticienSelectionne = praticiens?.find((p) => p.id === praticienId);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Gestion du cabinet
      </h1>

      {/* Sélection du praticien */}
      <Card className="mb-6">
        <h2 className="mb-4 font-semibold text-gray-900">
          Praticiens du cabinet
        </h2>

        {praticiensLoading && (
          <div className="flex justify-center py-6 text-primary">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {!praticiensLoading && praticiens?.length === 0 && (
          <p className="py-6 text-center text-gray-400">
            Aucun praticien rattaché à ce cabinet.
          </p>
        )}

        {!praticiensLoading && praticiens && praticiens.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {praticiens.map((p) => {
              const avatar =
                getImageUrl(p.photoProfil) || "/images/default-doctor.jpg";
              const isSelected = p.id === praticienId;
              return (
                <button
                  key={p.id}
                  onClick={() => setPraticienId(p.id)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={avatar}
                    alt={p.nomComplet}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {p.nomComplet}
                    </p>
                    <p className="text-xs text-gray-500">{p.specialite}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Fiche détaillée du médecin sélectionné */}
      {praticienSelectionne && (
        <Card className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <img
              src={
                getImageUrl(praticienSelectionne.photoProfil) ||
                "/images/default-doctor.jpg"
              }
              alt={praticienSelectionne.nomComplet}
              className="h-20 w-20 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">
                {praticienSelectionne.nomComplet}
              </h2>
              <p className="text-sm text-primary">
                {praticienSelectionne.specialite}
              </p>

              {praticienSelectionne.bio && (
                <p className="mt-2 text-sm text-gray-600">
                  {praticienSelectionne.bio}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                {praticienSelectionne.telephone && (
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {praticienSelectionne.telephone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase size={14} />{" "}
                  {praticienSelectionne.anneesExperience} ans d'expérience
                </span>
                {praticienSelectionne.nombreAvis > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star size={14} className="fill-amber-500" />
                    {praticienSelectionne.noteMoyenne.toFixed(1)} (
                    {praticienSelectionne.nombreAvis} avis)
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {praticienSelectionne.secteur}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {praticienSelectionne.honoraires} DH / consultation
                </span>
                {praticienSelectionne.accepteTeleconsult && (
                  <span className="flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-600">
                    <Video size={12} /> Téléconsultation
                  </span>
                )}
                {praticienSelectionne.accepteNouveauxPatients && (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    <CheckCircle size={12} /> Nouveaux patients
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Agenda du praticien sélectionné */}
      {praticienId && (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900">
              <Calendar size={18} /> Agenda
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
              <button
                onClick={() => setModalRdvOuvert(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
              >
                <CalendarPlus size={16} /> Nouveau RDV
              </button>
            </div>
          </div>

          {agendaLoading && (
            <div className="flex justify-center py-12 text-primary">
              <Loader2 className="animate-spin" size={28} />
            </div>
          )}

          {!agendaLoading && agenda?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
              Aucun rendez-vous ce jour-là.
            </div>
          )}

          {!agendaLoading && agenda && agenda.length > 0 && (
            <div className="space-y-3">
              {agenda.map((rdv) => (
                <div
                  key={rdv.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gray-50 text-sm font-bold text-gray-700">
                      {new Date(rdv.dateHeure).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {rdv.patient.prenom} {rdv.patient.nom}
                      </p>
                      <p className="text-sm text-gray-500">{rdv.motif}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {rdv.patient.telephone}
                        </span>
                        {rdv.patient.allergies && (
                          <span className="flex items-center gap-1 text-red-500">
                            <AlertCircle size={12} /> {rdv.patient.allergies}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {rdv.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {modalRdvOuvert && praticienSelectionne && (
        <NouveauRendezVousModal
          praticien={praticienSelectionne}
          onClose={() => setModalRdvOuvert(false)}
        />
      )}
    </div>
  );
}
