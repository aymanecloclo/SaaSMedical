using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.RendezVous.GetMesRendezVous
{
    public class GetMesRendezVousHandler
    {
        private readonly IRendezVousRepository _repo;

        public GetMesRendezVousHandler(IRendezVousRepository repo)
            => _repo = repo;

        public async Task<IEnumerable<MonRendezVousDto>> Handle(GetMesRendezVousQuery query)
        {
            var rdvs = await _repo.GetByPatientAsync(query.PatientId, query.AVenir);

            return rdvs.Select(r => new MonRendezVousDto(
                r.Id,
                r.DateHeure,
                r.DureeMinutes,
                r.Motif,
                r.Statut,
                r.EstTeleconsultation,
                r.PraticienId,
                $"Dr. {r.Praticien.Prenom} {r.Praticien.Nom}",
                r.Praticien.PhotoProfil,
                r.Praticien.Specialite?.NomFr ?? "",
                r.Praticien.Cabinet?.Ville?.NomFr ?? "",
                r.Praticien.Honoraires
            ));
        }
    }
}
