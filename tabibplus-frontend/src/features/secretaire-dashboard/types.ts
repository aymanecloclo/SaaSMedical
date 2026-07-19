export interface PraticienDuCabinet {
  id: number;
  cabinetId: number;
  nomComplet: string;
  specialite: string;
  photoProfil: string | null;
  telephone: string | null;
  bio: string | null;
  anneesExperience: number;
  langues: string | null;
  honoraires: number;
  secteur: string;
  accepteTeleconsult: boolean;
  accepteNouveauxPatients: boolean;
  noteMoyenne: number;
  nombreAvis: number;
}

export interface RegisterSecretaireRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone: string;
}

export interface PatientRecherche {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  telephone: string;
  email: string | null;
  age: number;
  sexe: string;
}

export interface CreatePatientRequest {
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  sexe: string;
  email?: string;
  adresse?: string;
  groupeSanguin?: string;
  allergies?: string;
  antecedents?: string;
  medicaments?: string;
  numeroAssurance?: string;
  typeAssurance?: string;
  contactUrgenceNom?: string;
  contactUrgenceTel?: string;
  consentementDonne: boolean;
}

export interface DisponibiliteSecretaire {
  dateHeure: string;
  heure: string;
  libre: boolean;
}

export interface CreateRendezVousSecretaireRequest {
  patientId: number;
  praticienId: number;
  cabinetId: number;
  dateHeure: string;
  dureeMinutes: number;
  motif: string;
  estTeleconsultation: boolean;
  source: string;
}
