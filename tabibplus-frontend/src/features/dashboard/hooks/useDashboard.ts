import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getStats,
  getAgendaJour,
  getAgendaSemaine,
  changerStatut,
} from "../api/dashboardApi";
import type { ChangerStatutRequest } from "../types";

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
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ChangerStatutRequest;
    }) => changerStatut(id, payload),
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
