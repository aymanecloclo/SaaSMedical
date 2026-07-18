export interface PraticienStats {
  rdvAujourdhui: number;
  rdvCeMois: number;
  nbPatientsUniques: number;
  rdvTermines: number;
}

export interface PatientAgenda {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  allergies: string | null;
}

export interface RendezVousAgenda {
  id: number;
  dateHeure: string;
  dureeMinutes: number;
  motif: string;
  statut: string;
  estTeleconsultation: boolean;
  source: string;
  patient: PatientAgenda;
}

export interface ChangerStatutRequest {
  nouveauStatut: string;
  notes?: string;
}

export const STATUTS_RDV = [
  "Confirme",
  "Arrive",
  "EnConsultation",
  "Termine",
  "Absent",
  "Reporte",
  "Annule",
] as const;

export const STATUT_LABELS: Record<string, string> = {
  Confirme: "Confirmé",
  Arrive: "Arrivé",
  EnConsultation: "En consultation",
  Termine: "Terminé",
  Absent: "Absent",
  Reporte: "Reporté",
  Annule: "Annulé",
};

export const STATUT_COULEURS: Record<string, string> = {
  Confirme: "bg-blue-100 text-blue-700",
  Arrive: "bg-amber-100 text-amber-700",
  EnConsultation: "bg-purple-100 text-purple-700",
  Termine: "bg-green-100 text-green-700",
  Absent: "bg-gray-100 text-gray-700",
  Reporte: "bg-orange-100 text-orange-700",
  Annule: "bg-red-100 text-red-700",
};
