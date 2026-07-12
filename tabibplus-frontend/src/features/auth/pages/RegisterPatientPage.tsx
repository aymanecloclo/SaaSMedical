import { useForm } from "react-hook-form";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useRegisterPatient } from "../hooks/useRegisterPatient";
import type { RegisterPatientFormValues } from "../types";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export function RegisterPatientPage() {
  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<RegisterPatientFormValues>();
  const mutation = useRegisterPatient();

  const motDePasse = watch("motDePasse");

  const onSubmit = (values: RegisterPatientFormValues) => {
    // On retire confirmMotDePasse — pas envoyé au backend
    const { confirmMotDePasse, ...payload } = values;
    mutation.mutate(payload);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl [animation-delay:1s]" />

      <Card className="relative w-full max-w-lg animate-fadeIn">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Inscription patient</h1>
          <p className="mt-1 text-sm text-gray-500">Créez votre compte en quelques instants</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              icon={<User size={18} />}
              placeholder="Karim"
              error={errors.prenom?.message}
              {...register("prenom", { required: "Prénom requis" })}
            />
            <Input
              label="Nom"
              icon={<User size={18} />}
              placeholder="Amrani"
              error={errors.nom?.message}
              {...register("nom", { required: "Nom requis" })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="vous@exemple.ma"
            error={errors.email?.message}
            {...register("email", {
              required: "Email requis",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" },
            })}
          />

          <Input
            label="Téléphone"
            icon={<Phone size={18} />}
            placeholder="0600000000"
            error={errors.telephone?.message}
            {...register("telephone", { required: "Téléphone requis" })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Date de naissance"
              type="date"
              error={errors.dateNaissance?.message}
              {...register("dateNaissance", { required: "Date requise" })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Sexe</label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white/50 py-2.5 px-3 text-gray-900 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                {...register("sexe", { required: "Sexe requis" })}
              >
                <option value="">Choisir...</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
              {errors.sexe && <p className="mt-1.5 text-sm text-red-500">{errors.sexe.message}</p>}
            </div>
          </div>

          <Input
            label="Mot de passe"
            type="password"
            icon={<Lock size={18} />}
            placeholder="••••••••"
            error={errors.motDePasse?.message}
            {...register("motDePasse", {
              required: "Mot de passe requis",
              minLength: { value: 6, message: "6 caractères minimum" },
            })}
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            icon={<Lock size={18} />}
            placeholder="••••••••"
            error={errors.confirmMotDePasse?.message}
            {...register("confirmMotDePasse", {
              required: "Confirmation requise",
              validate: (v) => v === motDePasse || "Les mots de passe ne correspondent pas",
            })}
          />

          {/* Consentement CNDP — obligatoire */}
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("consentementDonne", { required: "Le consentement est obligatoire" })}
            />
            <span>
              J'accepte que mes données personnelles soient traitées conformément à la loi 09-08 (CNDP).
            </span>
          </label>
          {errors.consentementDonne && (
            <p className="text-sm text-red-500">{errors.consentementDonne.message}</p>
          )}

          <Button type="submit" isLoading={mutation.isPending}>
            {mutation.isPending ? "Création..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Se connecter
          </a>
        </p>
      </Card>
    </div>
  );
}