using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.RendezVous.GetAgendaJour
{
    public class GetAgendaJourHandler
    {
        private readonly IRendezVousRepository _repo;

        public GetAgendaJourHandler(IRendezVousRepository repo)
            => _repo = repo;

        public async Task<IEnumerable<RendezVousAgendaDto>> Handle(GetAgendaJourQuery query)
        {
            var rdvs = await _repo.GetByPraticienAsync(query.PraticienId, query.Date);

            return rdvs.Select(r => new RendezVousAgendaDto(
                r.Id,
                r.DateHeure,
                r.DureeMinutes,
                r.Motif,
                r.Statut,
                r.EstTeleconsultation,
                r.Source,
                new PatientAgendaDto(
                    r.Patient.Id,
                    r.Patient.Nom,
                    r.Patient.Prenom,
                    r.Patient.Telephone,
                    r.Patient.Allergies
                )
            ));
        }
    }
}
