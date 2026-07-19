using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Application.RendezVous.GetAgendaJour;

namespace TabibPlus.Application.RendezVous.GetAgendaSemaine
{
    public class GetAgendaSemaineHandler
    {
        private readonly IRendezVousRepository _repo;

        public GetAgendaSemaineHandler(IRendezVousRepository repo)
            => _repo = repo;

        public async Task<IEnumerable<RendezVousAgendaDto>> Handle(GetAgendaSemaineQuery query)
        {
            var dateFin = query.DateDebut.Date.AddDays(7);
            var rdvs = await _repo.GetByPraticienRangeAsync(
                query.PraticienId, query.DateDebut, dateFin);

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
