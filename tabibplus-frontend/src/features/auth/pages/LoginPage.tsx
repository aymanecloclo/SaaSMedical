import { useForm } from "react-hook-form";
import { Stethoscope, Mail, Lock } from "lucide-react";
import { useLogin } from "../hooks/useLogin";
import type { LoginRequest } from "../types";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const loginMutation = useLogin();

  const onSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4">
      {/* Halos animés */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl [animation-delay:1s]" />

      <Card className="relative w-full max-w-md animate-fadeIn">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105 hover:rotate-3">
            <Stethoscope size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenue sur TabibPlus</h1>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="admin@tabibplus.ma"
            error={errors.email?.message}
            {...register("email", { required: "Email requis" })}
          />

          <Input
            label="Mot de passe"
            type="password"
            icon={<Lock size={18} />}
            placeholder="••••••••"
            error={errors.motDePasse?.message}
            {...register("motDePasse", { required: "Mot de passe requis" })}
          />

          <Button type="submit" isLoading={loginMutation.isPending}>
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{" "}
          <a href="/register" className="font-medium text-primary hover:underline">
            S'inscrire
          </a>
        </p>
      </Card>
    </div>
  );
}