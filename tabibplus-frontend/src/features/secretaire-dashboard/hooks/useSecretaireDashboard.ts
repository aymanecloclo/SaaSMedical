import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getPraticiensDuCabinet,
  getAgendaPraticien,
  registerSecretaire,
  rechercherPatients,
  creerPatient,
  getDisponibilitesSecretaire,
  creerRendezVousSecretaire,
} from "../api/secretaireApi";
import type {
  RegisterSecretaireRequest,
  CreatePatientRequest,
  CreateRendezVousSecretaireRequest,
} from "../types";

export function usePraticiensDuCabinet() {
  return useQuery({
    queryKey: ["praticiens-cabinet"],
    queryFn: getPraticiensDuCabinet,
  });
}

export function useAgendaPraticien(praticienId: number, date: string) {
  return useQuery({
    queryKey: ["agenda-praticien", praticienId, date],
    queryFn: () => getAgendaPraticien(praticienId, date),
    enabled: !!praticienId && !!date,
  });
}

export function useRegisterSecretaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterSecretaireRequest) => registerSecretaire(payload),
    onSuccess: () => {
      toast.success("Secrétaire inscrite avec succès");
      queryClient.invalidateQueries({ queryKey: ["mes-secretaires"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Erreur lors de l'inscription";
      toast.error(msg);
    },
  });
}

export function useRechercherPatients(q: string) {
  return useQuery({
    queryKey: ["recherche-patients", q],
    queryFn: () => rechercherPatients(q),
    enabled: q.trim().length >= 2,
  });
}

export function useCreerPatient() {
  return useMutation({
    mutationFn: (payload: CreatePatientRequest) => creerPatient(payload),
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Erreur lors de la création du patient";
      toast.error(msg);
    },
  });
}

export function useDisponibilitesSecretaire(praticienId: number, date: string) {
  return useQuery({
    queryKey: ["disponibilites-secretaire", praticienId, date],
    queryFn: () => getDisponibilitesSecretaire(praticienId, date),
    enabled: !!praticienId && !!date,
  });
}

export function useCreerRendezVousSecretaire() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRendezVousSecretaireRequest) =>
      creerRendezVousSecretaire(payload),
    onSuccess: () => {
      toast.success("Rendez-vous créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["agenda-praticien"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Erreur lors de la création du rendez-vous";
      toast.error(msg);
    },
  });
}
