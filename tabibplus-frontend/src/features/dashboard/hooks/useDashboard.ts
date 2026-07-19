import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getStats,
  getAgendaJour,
  getAgendaSemaine,
  changerStatut,
  getMesSecretaires,
  getMonCabinet,
  getMesPlagesHoraires,
  updateMesPlagesHoraires,
} from "../api/dashboardApi";
import type { ChangerStatutRequest, PlageHoraireJour } from "../types";

export function usePraticienStats() {
  return useQuery({
    queryKey: ["praticien-stats"],
    queryFn: getStats,
  });
}

export function useAgendaJour(date: string) {
  return useQuery({
    queryKey: ["agenda-jour", date],
    queryFn: () => getAgendaJour(date),
  });
}

export function useAgendaSemaine(dateDebut: string) {
  return useQuery({
    queryKey: ["agenda-semaine", dateDebut],
    queryFn: () => getAgendaSemaine(dateDebut),
  });
}

export function useChangerStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ChangerStatutRequest }) =>
      changerStatut(id, payload),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["agenda-jour"] });
      queryClient.invalidateQueries({ queryKey: ["agenda-semaine"] });
      queryClient.invalidateQueries({ queryKey: ["praticien-stats"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });
}

export function useMesSecretaires() {
  return useQuery({
    queryKey: ["mes-secretaires"],
    queryFn: getMesSecretaires,
  });
}

export function useMonCabinet() {
  return useQuery({
    queryKey: ["mon-cabinet"],
    queryFn: getMonCabinet,
  });
}

export function useMesPlagesHoraires() {
  return useQuery({
    queryKey: ["mes-plages-horaires"],
    queryFn: getMesPlagesHoraires,
  });
}

export function useUpdatePlagesHoraires() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plages: PlageHoraireJour[]) => updateMesPlagesHoraires(plages),
    onSuccess: () => {
      toast.success("Horaires mis à jour");
      queryClient.invalidateQueries({ queryKey: ["mes-plages-horaires"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des horaires");
    },
  });
}
