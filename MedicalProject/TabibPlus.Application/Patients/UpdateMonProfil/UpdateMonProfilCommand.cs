namespace TabibPlus.Application.Patients.UpdateMonProfil
{
    public record UpdateMonProfilCommand(
        int PatientId,
        string Telephone,
        string? Adresse,
        string? GroupeSanguin,
        string? Allergies,
        string? Antecedents,
        string? Medicaments,
        string? ContactUrgenceNom,
        string? ContactUrgenceTel
    );
}
