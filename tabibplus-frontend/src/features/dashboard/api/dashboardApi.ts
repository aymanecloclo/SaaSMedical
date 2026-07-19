import api from "../../../lib/api";
import type {
  PraticienStats,
  RendezVousAgenda,
  ChangerStatutRequest,
  SecretaireDuCabinet,
  MonCabinetInfo,
  PlageHoraireJour,
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

export async function getMesSecretaires(): Promise<SecretaireDuCabinet[]> {
  const { data } = await api.get<SecretaireDuCabinet[]>("/praticien/secretaires");
  return data;
}

export async function getMonCabinet(): Promise<MonCabinetInfo> {
  const { data } = await api.get<MonCabinetInfo>("/praticien/mon-cabinet");
  return data;
}

export async function getMesPlagesHoraires(): Promise<PlageHoraireJour[]> {
  const { data } = await api.get<PlageHoraireJour[]>("/praticien/plages-horaires");
  return data;
}

export async function updateMesPlagesHoraires(plages: PlageHoraireJour[]): Promise<void> {
  await api.put("/praticien/plages-horaires", plages);
}
