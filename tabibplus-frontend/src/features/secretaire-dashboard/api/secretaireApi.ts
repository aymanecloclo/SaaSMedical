import api from "../../../lib/api";
import type {
  PraticienDuCabinet,
  RegisterSecretaireRequest,
  PatientRecherche,
  CreatePatientRequest,
  DisponibiliteSecretaire,
  CreateRendezVousSecretaireRequest,
} from "../types";
import type { RendezVousAgenda } from "../../dashboard/types";

export async function getPraticiensDuCabinet(): Promise<PraticienDuCabinet[]> {
  const { data } = await api.get<PraticienDuCabinet[]>("/secretaire/praticiens");
  return data;
}

export async function getAgendaPraticien(
  praticienId: number,
  date: string
): Promise<RendezVousAgenda[]> {
  const { data } = await api.get<RendezVousAgenda[]>("/secretaire/agenda", {
    params: { praticienId, date },
  });
  return data;
}

export async function registerSecretaire(
  payload: RegisterSecretaireRequest
): Promise<void> {
  await api.post("/auth/register-secretaire", payload);
}

export async function rechercherPatients(q: string): Promise<PatientRecherche[]> {
  const { data } = await api.get<PatientRecherche[]>("/patients", {
    params: { q },
  });
  return data;
}

export async function creerPatient(
  payload: CreatePatientRequest
): Promise<{ id: number }> {
  const { data } = await api.post<{ id: number }>("/patients", payload);
  return data;
}

export async function getDisponibilitesSecretaire(
  praticienId: number,
  date: string
): Promise<DisponibiliteSecretaire[]> {
  const { data } = await api.get<DisponibiliteSecretaire[]>("/rendezvous/disponibilites", {
    params: { praticienId, date },
  });
  return data;
}

export async function creerRendezVousSecretaire(
  payload: CreateRendezVousSecretaireRequest
): Promise<{ id: number; message: string }> {
  const { data } = await api.post("/rendezvous", payload);
  return data;
}
