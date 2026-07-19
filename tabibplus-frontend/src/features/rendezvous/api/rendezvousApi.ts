import api from "../../../lib/api";
import type {
  Disponibilite,
  CreateRendezVousRequest,
  CreateRendezVousResponse,
} from "../types";

export async function getDisponibilites(
  praticienId: number,
  date: string
): Promise<Disponibilite[]> {
  const { data } = await api.get<Disponibilite[]>("/rendezvous/disponibilites", {
    params: { praticienId, date },
  });
  return data;
}

export async function createRendezVous(
  payload: CreateRendezVousRequest
): Promise<CreateRendezVousResponse> {
  const { data } = await api.post<CreateRendezVousResponse>("/rendezvous", payload);
  return data;
}
