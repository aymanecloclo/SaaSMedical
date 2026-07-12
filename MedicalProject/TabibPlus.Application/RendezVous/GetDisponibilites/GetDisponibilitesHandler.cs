using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.RendezVous.GetDisponibilites
{
    public class GetDisponibilitesHandler
    {
        private readonly IPraticienRepository _praticienRepo;
        private readonly IRendezVousRepository _rdvRepo;

        public GetDisponibilitesHandler(
            IPraticienRepository praticienRepo,
            IRendezVousRepository rdvRepo)
        {
            _praticienRepo = praticienRepo;
            _rdvRepo = rdvRepo;
        }

        public async Task<IEnumerable<DisponibiliteDto>> Handle(
            GetDisponibilitesQuery query)
        {
            // Récupérer les créneaux du praticien
            var creneaux = await _praticienRepo
                .GetDisponibilitesAsync(
                    query.PraticienId,
                    query.Date);

            // Pour chaque créneau vérifier s'il est libre
            var result = new List<DisponibiliteDto>();

            foreach (var creneau in creneaux)
            {
                bool libre = await _rdvRepo.CreneauEstLibreAsync(
                    query.PraticienId, creneau);

                result.Add(new DisponibiliteDto(
                    creneau,
                    creneau.ToString("HH:mm"),
                    libre
                ));
            }

            return result;
        }
    }
}