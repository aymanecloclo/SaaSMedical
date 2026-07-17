import api from "../../../lib/api";
import type {
  Praticien,
  SearchFilters,
  PraticienDetail,
  PraticienPage,
} from "../type";

export async function searchPraticiens(
  filters: SearchFilters,
): Promise<PraticienPage> {
  const { data } = await api.get<PraticienPage>("/public/praticiens", {
    params: {
      specialite: filters.specialite,
      ville: filters.ville,
      secteur: filters.secteur,
      teleconsult: filters.teleconsult,
      page: filters.page ?? 1,
      taille: 20,
    },
  });
  return data;
}

export async function getPraticienById(id: number): Promise<PraticienDetail> {
  const { data } = await api.get<PraticienDetail>(`/public/praticiens/${id}`);
  return data;
}

////