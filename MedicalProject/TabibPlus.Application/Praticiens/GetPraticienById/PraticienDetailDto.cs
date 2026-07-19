namespace TabibPlus.Application.Praticiens.GetPraticienById
{
public record PraticienDetailDto(
int Id,
string NomComplet,
string Specialite,
string? PhotoProfil,
string? Bio,
int AnneesExperience,
string? Langues,
string? Diplomes,
decimal Honoraires,
string Secteur,
bool AccepteTeleconsult,
bool AccepteNouveauxPatients,
decimal NoteMoyenne,
int NombreAvis,
string Ville,
string Adresse,
double? Latitude,
double? Longitude,
string? SiteWeb,
string? Telephone,
int CabinetId
);
}
