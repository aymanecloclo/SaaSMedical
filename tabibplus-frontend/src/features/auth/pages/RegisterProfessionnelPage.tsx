import { useForm } from "react-hook-form";
import { Mail, Lock, User, Phone, Building2, MapPin } from "lucide-react";
import { useRegisterProfessionnel } from "../hooks/useRegisterProfessionnel";
import { useSpecialites, useVilles } from "../hooks/useReferences";
import type { RegisterProfessionnelFormValues } from "../types";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

const SECTEURS = ["CNOPS", "CNSS", "Libre", "CNOPS_CNSS"];

export function RegisterProfessionnelPage() {
  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<RegisterProfessionnelFormValues>();
  const mutation = useRegisterProfessionnel();
  const { data: specialites, isLoading: loadingSpec } = useSpecialites();
  const { data: villes, isLoading: loadingVilles } = useVilles();

  const motDePasse = watch("motDePasse");

  const onSubmit = (values: RegisterProfessionnelFormValues) => {
    const { confirmMotDePasse, ...payload } = values;
    // Les selects renvoient des strings → on convertit les Id en nombres
    mutation.mutate({
      ...payload,
      specialiteId: Number(payload.specialiteId),
      villeId: Number(payload.villeId),
    });
  };

  const selectClass =
    "w-full rounded-xl border border-gray-200 bg-white/50 py-2.5 px-3 text-gray-900 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 px-4 py-8">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl [animation-delay:1s]" />

      <Card className="relative w-full max-w-2xl animate-fadeIn">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Inscription praticien</h1>
          <p className="mt-1 text-sm text-gray-500">Créez votre espace professionnel</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Identité */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              icon={<User size={18} />}
              placeholder="Rachid"
              error={errors.prenom?.message}
              {...register("prenom", { required: "Prénom requis" })}
            />
            <Input
              label="Nom"
              icon={<User size={18} />}
              placeholder="Benjelloun"
              error={errors.nom?.message}
              {...register("nom", { required: "Nom requis" })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="dr.benjelloun@exemple.ma"
            error={errors.email?.message}
            {...register("email", {
              required: "Email requis",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Email invalide" },
            })}
          />

          <Input
            label="Téléphone"
            icon={<Phone size={18} />}
            placeholder="0522000000"
            error={errors.telephone?.message}
            {...register("telephone", { required: "Téléphone requis" })}
          />

          {/* Spécialité + Secteur */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Spécialité</label>
              <select
                className={selectClass}
                disabled={loadingSpec}
                {...register("specialiteId", { required: "Spécialité requise" })}
              >
                <option value="">{loadingSpec ? "Chargement..." : "Choisir..."}</option>
                {specialites?.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
              {errors.specialiteId && <p className="mt-1.5 text-sm text-red-500">{errors.specialiteId.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Secteur</label>
              <select
                className={selectClass}
                {...register("secteur", { required: "Secteur requis" })}
              >
                <option value="">Choisir...</option>
                {SECTEURS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.secteur && <p className="mt-1.5 text-sm text-red-500">{errors.secteur.message}</p>}
            </div>
          </div>

          {/* Cabinet */}
          <Input
            label="Nom du cabinet"
            icon={<Building2 size={18} />}
            placeholder="Cabinet Cardiologie Casablanca"
            error={errors.cabinetNom?.message}
            {...register("cabinetNom", { required: "Nom du cabinet requis" })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Adresse"
              icon={<MapPin size={18} />}
              placeholder="45 Bd Zerktouni"
              error={errors.adresse?.message}
              {...register("adresse", { required: "Adresse requise" })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Ville</label>
              <select
                className={selectClass}
                disabled={loadingVilles}
                {...register("villeId", { required: "Ville requise" })}
              >
                <option value="">{loadingVilles ? "Chargement..." : "Choisir..."}</option>
                {villes?.map((v) => (
                  <option key={v.id} value={v.id}>{v.nom}</option>
                ))}
              </select>
              {errors.villeId && <p className="mt-1.5 text-sm text-red-500">{errors.villeId.message}</p>}
            </div>
          </div>

          {/* Mots de passe */}
          <div className="grid gap-4 sm:grid-cols-2">
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
              label="Confirmer"
              type="password"
              icon={<Lock size={18} />}
              placeholder="••••••••"
              error={errors.confirmMotDePasse?.message}
              {...register("confirmMotDePasse", {
                required: "Confirmation requise",
                validate: (v) => v === motDePasse || "Les mots de passe ne correspondent pas",
              })}
            />
          </div>

          <Button type="submit" isLoading={mutation.isPending}>
            {mutation.isPending ? "Création..." : "Créer mon compte praticien"}
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