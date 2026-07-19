import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Search, UserPlus, Loader2, Calendar, Check } from "lucide-react";
import {
  useRechercherPatients,
  useCreerPatient,
  useDisponibilitesSecretaire,
  useCreerRendezVousSecretaire,
} from "../hooks/useSecretaireDashboard";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import type { PatientRecherche, CreatePatientRequest, PraticienDuCabinet } from "../types";

interface Props {
  praticien: PraticienDuCabinet;
  onClose: () => void;
}

function formatDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

type Etape = "patient" | "nouveau-patient" | "creneau";

export function NouveauRendezVousModal({ praticien, onClose }: Props) {
  const [etape, setEtape] = useState<Etape>("patient");
  const [recherche, setRecherche] = useState("");
  const [patientSelectionne, setPatientSelectionne] = useState<PatientRecherche | null>(null);
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [creneauSelectionne, setCreneauSelectionne] = useState<string | null>(null);
  const [motif, setMotif] = useState("");

  const { data: resultats, isLoading: rechercheLoading } = useRechercherPatients(recherche);
  const creerPatientMutation = useCreerPatient();
  const { data: disponibilites, isLoading: dispoLoading } = useDisponibilitesSecretaire(
    praticien.id,
    date
  );
  const creerRdvMutation = useCreerRendezVousSecretaire();

  const {
    register: registerPatient,
    handleSubmit: handleSubmitPatient,
    formState: { errors: errorsPatient },
  } = useForm<CreatePatientRequest>();

  const onCreerPatient = (values: CreatePatientRequest) => {
    creerPatientMutation.mutate(
      { ...values, consentementDonne: true },
      {
        onSuccess: (data) => {
          setPatientSelectionne({
            id: data.id,
            nom: values.nom,
            prenom: values.prenom,
            nomComplet: `${values.prenom} ${values.nom}`,
            telephone: values.telephone,
            email: values.email ?? null,
            age: 0,
            sexe: values.sexe,
          });
          setEtape("creneau");
        },
      }
    );
  };

  const handleConfirmer = () => {
    if (!patientSelectionne || !creneauSelectionne) return;

    creerRdvMutation.mutate(
      {
        patientId: patientSelectionne.id,
        praticienId: praticien.id,
       cabinetId: praticien.cabinetId, // sera vérifié/rempli côté backend via le praticien
        dateHeure: creneauSelectionne,
        dureeMinutes: 30,
        motif: motif.trim() || "Consultation",
        estTeleconsultation: false,
        source: "Cabinet",
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Nouveau rendez-vous — {praticien.nomComplet}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* ÉTAPE 1 : Rechercher un patient */}
        {etape === "patient" && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher par nom, prénom, téléphone..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            {rechercheLoading && (
              <div className="flex justify-center py-6 text-primary">
                <Loader2 className="animate-spin" size={22} />
              </div>
            )}

            {!rechercheLoading && recherche.trim().length >= 2 && resultats?.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400">
                Aucun patient trouvé.
              </p>
            )}

            {!rechercheLoading && resultats && resultats.length > 0 && (
              <div className="max-h-56 space-y-2 overflow-y-auto">
                {resultats.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPatientSelectionne(p);
                      setEtape("creneau");
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-3 text-left transition hover:border-primary"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{p.nomComplet}</p>
                      <p className="text-xs text-gray-500">{p.telephone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setEtape("nouveau-patient")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary"
            >
              <UserPlus size={16} /> Créer une nouvelle fiche patient
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : Créer un nouveau patient */}
        {etape === "nouveau-patient" && (
          <form onSubmit={handleSubmitPatient(onCreerPatient)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Prénom"
                error={errorsPatient.prenom?.message}
                {...registerPatient("prenom", { required: "Prénom requis" })}
              />
              <Input
                label="Nom"
                error={errorsPatient.nom?.message}
                {...registerPatient("nom", { required: "Nom requis" })}
              />
            </div>

            <Input
              label="Téléphone"
              error={errorsPatient.telephone?.message}
              {...registerPatient("telephone", { required: "Téléphone requis" })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date de naissance"
                type="date"
                error={errorsPatient.dateNaissance?.message}
                {...registerPatient("dateNaissance", { required: "Date requise" })}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Sexe</label>
                <select
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  {...registerPatient("sexe", { required: true })}
                >
                  <option value="">Choisir...</option>
                  <option value="M">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEtape("patient")}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Retour
              </button>
              <Button type="submit" isLoading={creerPatientMutation.isPending}>
                Créer et continuer
              </Button>
            </div>
          </form>
        )}

        {/* ÉTAPE 3 : Choisir le créneau */}
        {etape === "creneau" && patientSelectionne && (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/5 p-3">
              <p className="text-sm font-semibold text-gray-900">
                Patient : {patientSelectionne.nomComplet}
              </p>
              <p className="text-xs text-gray-500">{patientSelectionne.telephone}</p>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar size={16} /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setCreneauSelectionne(null);
                }}
                className="w-full rounded-xl border border-gray-200 py-2.5 px-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Créneaux disponibles
              </label>

              {dispoLoading && (
                <div className="flex justify-center py-6 text-primary">
                  <Loader2 className="animate-spin" size={22} />
                </div>
              )}

              {!dispoLoading && disponibilites?.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-400">
                  Aucun créneau disponible ce jour-là.
                </p>
              )}

              {!dispoLoading && disponibilites && disponibilites.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {disponibilites.map((c) => (
                    <button
                      key={c.dateHeure}
                      disabled={!c.libre}
                      onClick={() => setCreneauSelectionne(c.dateHeure)}
                      className={`rounded-xl py-2 text-sm font-medium transition ${
                        !c.libre
                          ? "cursor-not-allowed bg-gray-50 text-gray-300 line-through"
                          : creneauSelectionne === c.dateHeure
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {c.heure}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Motif
              </label>
              <textarea
                rows={2}
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="Ex : consultation de suivi..."
                className="w-full rounded-xl border border-gray-200 p-3 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEtape("patient")}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Retour
              </button>
              <Button
                onClick={handleConfirmer}
                isLoading={creerRdvMutation.isPending}
                disabled={!creneauSelectionne}
              >
                <Check size={16} /> Confirmer le RDV
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
