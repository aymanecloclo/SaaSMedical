namespace TabibPlus.Application.Auth.RegisterProfessionnel
{
    public record RegisterProfessionnelCommand(
        // ── Compte (User) ──
        string Email,
        string MotDePasse,

        // ── Praticien ──
        string Nom,
        string Prenom,
        string Telephone,
        int SpecialiteId,
        string Secteur,          // CNOPS | CNSS | Libre | CNOPS_CNSS
        string? PhotoProfil,     // NOUVEAU — URL renvoyée par /api/upload/image

        // ── Cabinet ──
        string CabinetNom,
        string Adresse,
        int VilleId
    );
}