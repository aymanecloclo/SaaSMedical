namespace TabibPlus.Application.Patients.GetPatients
{
    public record PatientDto(
        int Id,
        string Nom,
        string Prenom,
        string NomComplet,
        string Telephone,
        string? Email,
        int Age,
        string Sexe,
        string? GroupeSanguin,
        string? Allergies,
        string? TypeAssurance
    );
}