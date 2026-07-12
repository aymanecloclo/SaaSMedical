using System.Collections.Generic;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Praticiens.SearchPraticiens
{
    public class SearchPraticiensHandler
    {
        private readonly IPraticienRepository _repo;

        public SearchPraticiensHandler(IPraticienRepository repo)
            => _repo = repo;

        public async Task<IEnumerable<PraticienListeDto>> Handle(
            SearchPraticiensQuery query)
        {
            var praticiens = await _repo.SearchAsync(
                query.Specialite,
                query.Ville,
                query.Secteur,
                query.Teleconsult,
                query.DisponibleAujourdhui
            );

            return praticiens
                .Skip((query.Page - 1) * query.Taille)
                .Take(query.Taille)
                .Select(p => new PraticienListeDto(
                    p.Id,
                    p.Nom,
                    p.Prenom,
                    $"Dr. {p.Prenom} {p.Nom}",
                    p.Specialite?.NomFr ?? "", 
                    p.PhotoProfil,
                    p.Cabinet?.Ville ?? "",
                    p.Honoraires,
                    p.Secteur,
                    p.Langues,
                    p.AccepteTeleconsult,
                    p.AccepteNouveauxPatients,
                    p.NoteMoyenne,
                    p.NombreAvis,
                    p.AnneesExperience
                ));
        }
    }
}