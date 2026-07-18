namespace TabibPlus.Application.Praticiens.SearchPraticiens
{
    public record SearchPraticiensQuery(
        string? Specialite,
        string? Ville,
        string? Secteur,
        bool? Teleconsult,
        bool? DisponibleAujourdhui,
        string? Langue,
        int Page = 1,
        int Taille =20
    );
}