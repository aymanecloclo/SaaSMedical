import api from "../../../lib/api";
import type {
  PraticienStats,
  RendezVousAgenda,
  ChangerStatutRequest,
} from "../types";

export async function getStats(): Promise<PraticienStats> {
  const { data } = await api.get<PraticienStats>("/rendezvous/stats");
  return data;
}

export async function getAgendaJour(date: string): Promise<RendezVousAgenda[]> {
  const { data } = await api.get<RendezVousAgenda[]>("/rendezvous/agenda", {
    params: { date },
  });
  return data;
}

export async function getAgendaSemaine(dateDebut: string): Promise<RendezVousAgenda[]> {
  const { data } = await api.get<RendezVousAgenda[]>("/rendezvous/agenda-semaine", {
    params: { dateDebut },
  });
  return data;
}

export async function changerStatut(
  id: number,
  payload: ChangerStatutRequest
): Promise<void> {
  await api.put(`/rendezvous/${id}/statut`, payload);
}