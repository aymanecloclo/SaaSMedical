import api from "../../../lib/api";
import type { MonRendezVous, MonProfil, UpdateMonProfilRequest } from "../types";

export async function getMesRendezVous(aVenir: boolean): Promise<MonRendezVous[]> {
  const { data } = await api.get<MonRendezVous[]>("/rendezvous/mes-rendezvous", {
    params: { aVenir },
  });
  return data;
}

export async function annulerRendezVous(id: number): Promise<void> {
  await api.post(`/rendezvous/${id}/annuler`);
}

export async function getMonProfil(): Promise<MonProfil> {
  const { data } = await api.get<MonProfil>("/patients/me");
  return data;
}

export async function updateMonProfil(payload: UpdateMonProfilRequest): Promise<void> {
  await api.put("/patients/me", payload);
}
