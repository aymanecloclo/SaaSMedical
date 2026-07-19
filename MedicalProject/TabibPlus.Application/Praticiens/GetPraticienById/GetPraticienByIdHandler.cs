using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.Praticiens.GetPraticienById
{
public class GetPraticienByIdHandler
{
private readonly IPraticienRepository _repo;

public GetPraticienByIdHandler(IPraticienRepository repo)
=> _repo = repo;

public async Task<PraticienDetailDto?> Handle(
GetPraticienByIdQuery query)
{
var p = await _repo.GetByIdAsync(query.Id);
if (p == null) return null;

return new PraticienDetailDto(
p.Id,
$"Dr. {p.Prenom} {p.Nom}",
                p.Specialite?.NomFr ?? "",
                p.PhotoProfil,
p.Bio,
p.AnneesExperience,
p.Langues,
p.Diplomes,
p.Honoraires,
p.Secteur,
p.AccepteTeleconsult,
p.AccepteNouveauxPatients,
p.NoteMoyenne,
p.NombreAvis,
p.Cabinet?.Ville?.NomFr ?? "",
p.Cabinet?.Adresse ?? "",
p.Latitude,
p.Longitude,
p.SiteWeb,
p.User?.Telephone,
p.CabinetId
);
}
}
}
