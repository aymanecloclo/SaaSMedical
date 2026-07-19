namespace TabibPlus.Application.Auth.RegisterSecretaire
{
    public record RegisterSecretaireCommand(
        string Email,
        string MotDePasse,
        string Nom,
        string Prenom,
        string Telephone,
        int CabinetId   // rempli par le serveur depuis le praticien connecté, jamais par le client
    );
}
