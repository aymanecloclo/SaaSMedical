using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Patients.GetMonProfil
{
    public class GetMonProfilHandler
    {
        private readonly IPatientRepository _repo;

        public GetMonProfilHandler(IPatientRepository repo)
            => _repo = repo;

        public async Task<MonProfilDto?> Handle(GetMonProfilQuery query)
        {
            var p = await _repo.GetByIdAsync(query.PatientId);
            if (p == null) return null;

            return new MonProfilDto(
                p.Id,
                p.Nom,
                p.Prenom,
                p.DateNaissance,
                p.Telephone,
                p.Email,
                p.Sexe,
                p.Adresse,
                p.GroupeSanguin,
                p.Allergies,
                p.Antecedents,
                p.Medicaments,
                p.NumeroAssurance,
                p.TypeAssurance,
                p.ContactUrgenceNom,
                p.ContactUrgenceTel
            );
        }
    }
}
