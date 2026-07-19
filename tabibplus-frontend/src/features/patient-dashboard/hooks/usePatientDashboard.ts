import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getMesRendezVous,
  annulerRendezVous,
  getMonProfil,
  updateMonProfil,
} from "../api/patientDashboardApi";
import type { UpdateMonProfilRequest } from "../types";

export function useMesRendezVous(aVenir: boolean) {
  return useQuery({
    queryKey: ["mes-rendezvous", aVenir],
    queryFn: () => getMesRendezVous(aVenir),
  });
}

export function useAnnulerRendezVous() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => annulerRendezVous(id),
    onSuccess: () => {
      toast.success("Rendez-vous annulé");
      queryClient.invalidateQueries({ queryKey: ["mes-rendezvous"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'annulation");
    },
  });
}

export function useMonProfil() {
  return useQuery({
    queryKey: ["mon-profil"],
    queryFn: getMonProfil,
  });
}

export function useUpdateMonProfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMonProfilRequest) => updateMonProfil(payload),
    onSuccess: () => {
      toast.success("Profil mis à jour");
      queryClient.invalidateQueries({ queryKey: ["mon-profil"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });
}
