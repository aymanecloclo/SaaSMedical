import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMonProfil, useUpdateMonProfil } from "../hooks/usePatientDashboard";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import type { UpdateMonProfilRequest } from "../types";

export function MonProfilPage() {
  const navigate = useNavigate();
  const { data: profil, isLoading } = useMonProfil();
  const updateMutation = useUpdateMonProfil();

  const { register, handleSubmit, reset } = useForm<UpdateMonProfilRequest>();

  useEffect(() => {
    if (profil) {
      reset({
        telephone: profil.telephone,
        adresse: profil.adresse ?? "",
        groupeSanguin: profil.groupeSanguin ?? "",
        allergies: profil.allergies ?? "",
        antecedents: profil.antecedents ?? "",
        medicaments: profil.medicaments ?? "",
        contactUrgenceNom: profil.contactUrgenceNom ?? "",
        contactUrgenceTel: profil.contactUrgenceTel ?? "",
      });
    }
  }, [profil, reset]);

  const onSubmit = (values: UpdateMonProfilRequest) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-primary">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft size={16} /> Retour à mes rendez-vous
      </button>

      <Card>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            {profil?.prenom} {profil?.nom}
          </h1>
          <p className="text-sm text-gray-500">{profil?.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Téléphone"
            {...register("telephone", { required: true })}
          />

          <Input label="Adresse" {...register("adresse")} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Groupe sanguin
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white/50 py-2.5 px-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                {...register("groupeSanguin")}
              >
                <option value="">Non renseigné</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Allergies
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              {...register("allergies")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Antécédents médicaux
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              {...register("antecedents")}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Médicaments en cours
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-gray-200 bg-white/50 p-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              {...register("medicaments")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Contact d'urgence — nom"
              {...register("contactUrgenceNom")}
            />
            <Input
              label="Contact d'urgence — téléphone"
              {...register("contactUrgenceTel")}
            />
          </div>

          <Button type="submit" isLoading={updateMutation.isPending}>
            Enregistrer les modifications
          </Button>
        </form>
      </Card>
    </div>
  );
}
