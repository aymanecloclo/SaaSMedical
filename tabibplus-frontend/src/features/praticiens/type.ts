export interface Praticien {
  id: number;
  nom: string;
  prenom: string;
  nomComplet: string;
  specialite: string; // ⚠️ backend renvoie le cabinet ici (bug à corriger)
  photoProfil: string | null;
  ville: string;
  honoraires: number;
  secteur: string;
  langues: string;
  accepteTeleconsult: boolean;
  accepteNouveauxPatients: boolean;
  noteMoyenne: number;
  nombreAvis: number;
  anneesExperience: number;
}



export type SortOption = "note" | "prix_asc" | "prix_desc";
// Détail complet d'un praticien — correspond au PraticienDetailDto backend
export interface PraticienDetail {
  id: number;
  nomComplet: string;
  specialite: string;
  photoProfil: string | null;
  bio: string | null;
  anneesExperience: number;
  langues: string | null;
  diplomes: string | null;
  honoraires: number;
  secteur: string;
  accepteTeleconsult: boolean;
  accepteNouveauxPatients: boolean;
  noteMoyenne: number;
  nombreAvis: number;
  ville: string;
  adresse: string;
  latitude: number | null;
  longitude: number | null;
  siteWeb: string | null;
  telephone: string | null;
}

export interface SearchFilters {
  specialite?: string;
  ville?: string;
  secteur?: string;
  teleconsult?: boolean;
  page?: number; 
}

export interface PraticienPage {
  items: Praticien[];
  totalCount: number;
  page: number;
  taille: number;
  totalPages: number;
}