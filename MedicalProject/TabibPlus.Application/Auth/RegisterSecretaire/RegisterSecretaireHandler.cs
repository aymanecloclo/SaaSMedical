using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Auth.RegisterSecretaire
{
    public class RegisterSecretaireHandler
    {
        private readonly IUserRepository _userRepo;
        private readonly ICabinetRepository _cabinetRepo;

        public RegisterSecretaireHandler(
            IUserRepository userRepo,
            ICabinetRepository cabinetRepo)
        {
            _userRepo = userRepo;
            _cabinetRepo = cabinetRepo;
        }

        public async Task<int> Handle(RegisterSecretaireCommand cmd)
        {
            if (string.IsNullOrWhiteSpace(cmd.Email))
                throw new ArgumentException("L'email est obligatoire");

            if (string.IsNullOrWhiteSpace(cmd.MotDePasse) || cmd.MotDePasse.Length < 6)
                throw new ArgumentException("Le mot de passe doit faire au moins 6 caractères");

            if (string.IsNullOrWhiteSpace(cmd.Nom) || string.IsNullOrWhiteSpace(cmd.Prenom))
                throw new ArgumentException("Le nom et le prénom sont obligatoires");

            if (await _userRepo.EmailExisteAsync(cmd.Email))
                throw new InvalidOperationException("Cet email est déjà utilisé");

            var cabinet = await _cabinetRepo.GetByIdAsync(cmd.CabinetId);
            if (cabinet == null)
                throw new ArgumentException("Cabinet invalide");

            var user = new User
            {
                Email = cmd.Email.Trim().ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(cmd.MotDePasse),
                Role = "Secretaire",
                TypeCompte = "Professionnel",
                Nom = cmd.Nom.Trim(),
                Prenom = cmd.Prenom.Trim(),
                Telephone = cmd.Telephone,
                CabinetId = cmd.CabinetId
            };

            return await _userRepo.AddAsync(user);
        }
    }
}
