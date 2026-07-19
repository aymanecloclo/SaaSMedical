import { useState } from "react";
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  Phone,
  AlertCircle,
  UserPlus,
  Mail,
} from "lucide-react";
import {
  usePraticienStats,
  useAgendaJour,
  useChangerStatut,
  useMesSecretaires,
} from "../hooks/useDashboard";
import { HorairesEditor } from "../components/HorairesEditor";
import { AjouterSecretaireModal } from "../components/AjouterSecretaireModal";
import { Card } from "../../../components/ui/Card";
import { STATUTS_RDV, STATUT_LABELS, STATUT_COULEURS } from "../types";

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function PraticienDashboardPage() {
  const [dateSelectionnee, setDateSelectionnee] = useState(
    formatDateInput(new Date()),
  );
  const [modalOuvert, setModalOuvert] = useState(false);

  const { data: stats, isLoading: statsLoading } = usePraticienStats();
  const { data: agenda, isLoading: agendaLoading } =
    useAgendaJour(dateSelectionnee);
  const { data: secretaires, isLoading: secretairesLoading } =
    useMesSecretaires();
  const changerStatutMutation = useChangerStatut();

  const handleChangerStatut = (id: number, nouveauStatut: string) => {
    changerStatutMutation.mutate({ id, payload: { nouveauStatut } });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <button
          onClick={() => setModalOuvert(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
        >
          <UserPlus size={16} /> Ajouter une secrétaire
        </button>
      </div>

      {modalOuvert && (
        <AjouterSecretaireModal onClose={() => setModalOuvert(false)} />
      )}

      {/* Cartes statistiques */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {statsLoading ? "..." : (stats?.rdvAujourdhui ?? 0)}
            </p>
            <p className="text-sm text-gray-500">RDV aujourd'hui</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {statsLoading ? "..." : (stats?.rdvCeMois ?? 0)}
            </p>
            <p className="text-sm text-gray-500">RDV ce mois</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {statsLoading ? "..." : (stats?.nbPatientsUniques ?? 0)}
            </p>
            <p className="text-sm text-gray-500">Patients suivis</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {statsLoading ? "..." : (stats?.rdvTermines ?? 0)}
            </p>
            <p className="text-sm text-gray-500">Consultations terminées</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Agenda du jour — prend 2 colonnes */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Agenda</h2>
            <input
              type="date"
              value={dateSelectionnee}
              onChange={(e) => setDateSelectionnee(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
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
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gray-50 text-gray-700">
                      <span className="text-sm font-bold">
                        {new Date(rdv.dateHeure).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
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

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        STATUT_COULEURS[rdv.statut] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUT_LABELS[rdv.statut] ?? rdv.statut}
                    </span>

                    <select
                      value={rdv.statut}
                      onChange={(e) =>
                        handleChangerStatut(rdv.id, e.target.value)
                      }
                      disabled={changerStatutMutation.isPending}
                      className="rounded-xl border border-gray-200 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                    >
                      {STATUTS_RDV.map((s) => (
                        <option key={s} value={s}>
                          {STATUT_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Mes secrétaires — 1 colonne */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Mes secrétaires
          </h2>

          {secretairesLoading && (
            <div className="flex justify-center py-8 text-primary">
              <Loader2 className="animate-spin" size={24} />
            </div>
          )}

          {!secretairesLoading && secretaires?.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              Aucune secrétaire pour le moment.
            </p>
          )}

          {!secretairesLoading && secretaires && secretaires.length > 0 && (
            <div className="space-y-3">
              {secretaires.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-gray-100 p-3"
                >
                  <p className="font-semibold text-gray-900">
                    {s.prenom} {s.nom}
                  </p>
                  <div className="mt-1 space-y-1 text-xs text-gray-500">
                    <p className="flex items-center gap-1">
                      <Mail size={12} /> {s.email}
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone size={12} /> {s.telephone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Horaires de travail — pleine largeur, sous la grille principale */}
      <div className="mt-6">
        <HorairesEditor />
      </div>
    </div>
  );
}
