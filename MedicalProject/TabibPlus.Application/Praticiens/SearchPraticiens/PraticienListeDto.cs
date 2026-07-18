namespace TabibPlus.Application.Praticiens.SearchPraticiens
{
    public record PraticienListeDto(
        int Id,
        string Nom,
        string Prenom,
        string NomComplet,
        string Specialite,
        string? PhotoProfil,
        string Ville,
        decimal Honoraires,
        string Secteur,
        string? Langues,
        bool AccepteTeleconsult,
        bool AccepteNouveauxPatients,
        decimal NoteMoyenne,
        int NombreAvis,
        int AnneesExperience
    );
}