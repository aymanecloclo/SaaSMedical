using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Patients.CreatePatient
{
    public class CreatePatientHandler
    {
        private readonly IPatientRepository _repo;

        public CreatePatientHandler(IPatientRepository repo)
            => _repo = repo;

        public async Task<int> Handle(CreatePatientCommand cmd)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(cmd.Nom))
                throw new ArgumentException("Le nom est obligatoire");

            if (!cmd.ConsentementDonne)
                throw new ArgumentException(
                    "Le consentement CNDP est obligatoire");

            // Créer l'entité
            var patient = new Patient
            {
                Nom = cmd.Nom.ToUpper().Trim(),
                Prenom = cmd.Prenom.Trim(),
                DateNaissance = cmd.DateNaissance,
                Telephone = cmd.Telephone,
                Sexe = cmd.Sexe,
                Email = cmd.Email,
                Adresse = cmd.Adresse,
                GroupeSanguin = cmd.GroupeSanguin,
                Allergies = cmd.Allergies,
                Antecedents = cmd.Antecedents,
                Medicaments = cmd.Medicaments,
                NumeroAssurance = cmd.NumeroAssurance,
                TypeAssurance = cmd.TypeAssurance,
                ContactUrgenceNom = cmd.ContactUrgenceNom,
                ContactUrgenceTel = cmd.ContactUrgenceTel,
                ConsentementDonne = cmd.ConsentementDonne,
                DateConsentement = DateTime.UtcNow
            };

            await _repo.AddAsync(patient);
            return patient.Id;
        }
    }
}