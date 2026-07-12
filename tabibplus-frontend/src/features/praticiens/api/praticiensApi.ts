import api from "../../../lib/api";
import type { Praticien, SearchFilters, PraticienDetail } from "../type";

export async function searchPraticiens(filters: SearchFilters): Promise<Praticien[]> {
  const { data } = await api.get<Praticien[]>("/public/praticiens", {
    params: {
      specialite: filters.specialite,
      ville: filters.ville,
      secteur: filters.secteur,
      teleconsult: filters.teleconsult,
    },
  });
  return data;
}

export async function getPraticienById(id: number): Promise<PraticienDetail> {
  const { data } = await api.get<PraticienDetail>(`/public/praticiens/${id}`);
  return data;
}