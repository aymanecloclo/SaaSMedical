import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../AuthContext";
import type { LoginResponse } from "../types";

export function useLogin() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data: LoginResponse) => {
      setAuth(data.token, data.user);   // 1. met à jour le context D'ABORD
      toast.success("Connexion réussie");
      navigate("/dashboard", { replace: true });  // 2. puis navigue
    },
    onError: () => {
      toast.error("Email ou mot de passe incorrect");
    },
  });
}