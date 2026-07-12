import api from "../../../lib/api";
import type { Specialite, Ville } from "../types";

export async function getSpecialites(): Promise<Specialite[]> {
  const { data } = await api.get<Specialite[]>("/public/specialites");
  return data;
}

export async function getVilles(): Promise<Ville[]> {
  const { data } = await api.get<Ville[]>("/public/villes");
  return data;
}