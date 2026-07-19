using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Patients.UpdateMonProfil
{
    public class UpdateMonProfilHandler
    {
        private readonly IPatientRepository _repo;

        public UpdateMonProfilHandler(IPatientRepository repo)
            => _repo = repo;

        public async Task Handle(UpdateMonProfilCommand cmd)
        {
            var patient = await _repo.GetByIdAsync(cmd.PatientId);
            if (patient == null)
                throw new KeyNotFoundException("Patient introuvable");

            if (string.IsNullOrWhiteSpace(cmd.Telephone))
                throw new ArgumentException("Le téléphone est obligatoire");

            patient.Telephone = cmd.Telephone.Trim();
            patient.Adresse = cmd.Adresse?.Trim();
            patient.GroupeSanguin = cmd.GroupeSanguin;
            patient.Allergies = cmd.Allergies?.Trim();
            patient.Antecedents = cmd.Antecedents?.Trim();
            patient.Medicaments = cmd.Medicaments?.Trim();
            patient.ContactUrgenceNom = cmd.ContactUrgenceNom?.Trim();
            patient.ContactUrgenceTel = cmd.ContactUrgenceTel?.Trim();

            await _repo.UpdateAsync(patient);
        }
    }
}
