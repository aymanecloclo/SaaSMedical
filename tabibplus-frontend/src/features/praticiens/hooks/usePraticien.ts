import { useQuery } from "@tanstack/react-query";
import { getPraticienById } from "../api/praticiensApi";

export function usePraticien(id: number) {
  return useQuery({
    queryKey: ["praticien", id],
    queryFn: () => getPraticienById(id),
    enabled: !!id,   // ne lance pas la requête si l'id est absent
  });
}