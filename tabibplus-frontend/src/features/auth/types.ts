// Ce qu'on ENVOIE au login
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

// L'utilisateur tel que renvoyé par le backend
export interface User {
  id: number;
  email: string;
  role: string;              // ex: "Secretaire", "Admin", "Patient"...
  praticienId: number | null;
  nom: string;
}

// Ce qu'on REÇOIT du login
export interface LoginResponse {
  token: string;
  user: User;
}

// ── Inscription patient — correspond au RegisterPatientCommand backend ──
export interface RegisterPatientRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone: string;
  dateNaissance: string;   // format "YYYY-MM-DD"
  sexe: string;            // "M" ou "F"
  consentementDonne: boolean;
}

// Valeurs du formulaire (avec confirmation locale, non envoyée au backend)
export interface RegisterPatientFormValues extends RegisterPatientRequest {
  confirmMotDePasse: string;
}

// ── Données de référence (menus déroulants) ──
export interface Specialite {
  id: number;
  nom: string;
  categorie: string;
}

export interface Ville {
  id: number;
  nom: string;
  region: string;
}

// ── Inscription professionnel — correspond au RegisterProfessionnelCommand ──
export interface RegisterProfessionnelRequest {
  email: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  telephone: string;
  specialiteId: number;
  secteur: string;
  cabinetNom: string;
  adresse: string;
  villeId: number;
}

export interface RegisterProfessionnelFormValues extends RegisterProfessionnelRequest {
  confirmMotDePasse: string;
}