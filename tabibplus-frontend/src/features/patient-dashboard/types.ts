export interface MonRendezVous {
  id: number;
  dateHeure: string;
  dureeMinutes: number;
  motif: string;
  statut: string;
  estTeleconsultation: boolean;
  praticienId: number;
  praticienNomComplet: string;
  praticienPhoto: string | null;
  specialite: string;
  ville: string;
  honoraires: number;
}

export interface MonProfil {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email: string | null;
  sexe: string;
  adresse: string | null;
  groupeSanguin: string | null;
  allergies: string | null;
  antecedents: string | null;
  medicaments: string | null;
  numeroAssurance: string | null;
  typeAssurance: string | null;
  contactUrgenceNom: string | null;
  contactUrgenceTel: string | null;
}

export interface UpdateMonProfilRequest {
  telephone: string;
  adresse?: string;
  groupeSanguin?: string;
  allergies?: string;
  antecedents?: string;
  medicaments?: string;
  contactUrgenceNom?: string;
  contactUrgenceTel?: string;
}

export const STATUT_LABELS_PATIENT: Record<string, string> = {
  Confirme: "Confirmé",
  Arrive: "Arrivé au cabinet",
  EnConsultation: "En consultation",
  Termine: "Terminé",
  Absent: "Absence signalée",
  Reporte: "Reporté",
  Annule: "Annulé",
};

export const STATUT_COULEURS_PATIENT: Record<string, string> = {
  Confirme: "bg-blue-100 text-blue-700",
  Arrive: "bg-amber-100 text-amber-700",
  EnConsultation: "bg-purple-100 text-purple-700",
  Termine: "bg-green-100 text-green-700",
  Absent: "bg-gray-100 text-gray-700",
  Reporte: "bg-orange-100 text-orange-700",
  Annule: "bg-red-100 text-red-700",
};
