using System;

namespace TabibPlus.Application.Patients.CreatePatient
{
    public record CreatePatientCommand(
        string Nom,
        string Prenom,
        DateTime DateNaissance,
        string Telephone,
        string Sexe,
        string? Email,
        string? Adresse,
        string? GroupeSanguin,
        string? Allergies,
        string? Antecedents,
        string? Medicaments,
        string? NumeroAssurance,
        string? TypeAssurance,
        string? ContactUrgenceNom,
        string? ContactUrgenceTel,
        bool ConsentementDonne
    );
}