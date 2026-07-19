using System;

namespace TabibPlus.Application.Patients.GetMonProfil
{
    public record MonProfilDto(
        int Id,
        string Nom,
        string Prenom,
        DateTime DateNaissance,
        string Telephone,
        string? Email,
        string Sexe,
        string? Adresse,
        string? GroupeSanguin,
        string? Allergies,
        string? Antecedents,
        string? Medicaments,
        string? NumeroAssurance,
        string? TypeAssurance,
        string? ContactUrgenceNom,
        string? ContactUrgenceTel
    );
}
