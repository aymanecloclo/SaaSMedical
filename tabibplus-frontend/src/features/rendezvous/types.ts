export interface Disponibilite {
  dateHeure: string;
  heure: string;
  libre: boolean;
}

export interface CreateRendezVousRequest {
  patientId: number;
  praticienId: number;
  cabinetId: number;
  dateHeure: string;
  dureeMinutes: number;
  motif: string;
  estTeleconsultation: boolean;
  source: string;
}

export interface CreateRendezVousResponse {
  id: number;
  message: string;
}
