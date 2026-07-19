import { useQuery, useMutation } from "@tanstack/react-query";
import { getDisponibilites, createRendezVous } from "../api/rendezvousApi";
import type { CreateRendezVousRequest } from "../types";

export function useDisponibilites(praticienId: number, date: string) {
  return useQuery({
    queryKey: ["disponibilites", praticienId, date],
    queryFn: () => getDisponibilites(praticienId, date),
    enabled: !!praticienId && !!date,
  });
}

export function useCreateRendezVous() {
  return useMutation({
    mutationFn: (payload: CreateRendezVousRequest) => createRendezVous(payload),
  });
}
