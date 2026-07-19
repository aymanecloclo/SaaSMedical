import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useRegisterSecretaire } from "../../secretaire-dashboard/hooks/useSecretaireDashboard";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import type { RegisterSecretaireRequest } from "../../secretaire-dashboard/types";

interface Props {
  onClose: () => void;
}

export function AjouterSecretaireModal({ onClose }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSecretaireRequest>();
  const mutation = useRegisterSecretaire();

  const onSubmit = (values: RegisterSecretaireRequest) => {
    mutation.mutate(values, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Ajouter une secrétaire</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Prénom"
              error={errors.prenom?.message}
              {...register("prenom", { required: "Prénom requis" })}
            />
            <Input
              label="Nom"
              error={errors.nom?.message}
              {...register("nom", { required: "Nom requis" })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email", { required: "Email requis" })}
          />

          <Input
            label="Téléphone"
            error={errors.telephone?.message}
            {...register("telephone", { required: "Téléphone requis" })}
          />

          <Input
            label="Mot de passe temporaire"
            type="password"
            error={errors.motDePasse?.message}
            {...register("motDePasse", {
              required: "Mot de passe requis",
              minLength: { value: 6, message: "6 caractères minimum" },
            })}
          />

          <Button type="submit" isLoading={mutation.isPending}>
            Créer le compte
          </Button>
        </form>
      </div>
    </div>
  );
}
