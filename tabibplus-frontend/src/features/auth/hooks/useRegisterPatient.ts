import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerPatient } from "../api/authApi";
import { AxiosError } from "axios";

export function useRegisterPatient() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerPatient,
    onSuccess: () => {
      toast.success("Compte créé ! Vous pouvez vous connecter.");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      // On affiche le message précis du backend (email pris, consentement...)
      const msg = error.response?.data?.message ?? "Erreur lors de l'inscription";
      toast.error(msg);
    },
  });
}