import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { registerProfessionnel } from "../api/authApi";

export function useRegisterProfessionnel() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerProfessionnel,
    onSuccess: () => {
      toast.success("Compte professionnel créé ! Vous pouvez vous connecter.");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message ?? "Erreur lors de l'inscription";
      toast.error(msg);
    },
  });
}