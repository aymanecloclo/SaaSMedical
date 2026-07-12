using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Patients.GetPatients
{
	public class GetPatientsHandler
	{
		private readonly IPatientRepository _repo;

		public GetPatientsHandler(IPatientRepository repo)
			=> _repo = repo;

		public async Task<IEnumerable<PatientDto>> Handle(
			GetPatientsQuery query)
		{
			var patients = await _repo.SearchAsync(query.Recherche);

			return patients.Select(p => new PatientDto(
				p.Id,
				p.Nom,
				p.Prenom,
				$"{p.Prenom} {p.Nom}",
				p.Telephone,
				p.Email,
				DateTime.Today.Year - p.DateNaissance.Year,
				p.Sexe,
				p.GroupeSanguin,
				p.Allergies,
				p.TypeAssurance
			));
		}
	}
}