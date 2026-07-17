using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Auth.RegisterProfessionnel
{
    public class RegisterProfessionnelHandler
    {
        private readonly IUserRepository _userRepo;
        private readonly ICabinetRepository _cabinetRepo;
        private readonly IPraticienRepository _praticienRepo;
        private readonly IVilleRepository _villeRepo;

        public RegisterProfessionnelHandler(
            IUserRepository userRepo,
            ICabinetRepository cabinetRepo,
            IPraticienRepository praticienRepo,
            IVilleRepository villeRepo)
        {
            _userRepo = userRepo;
            _cabinetRepo = cabinetRepo;
            _praticienRepo = praticienRepo;
            _villeRepo = villeRepo;
        }

        public async Task<int> Handle(RegisterProfessionnelCommand cmd)
        {
            // 1. Validations métier
            if (string.IsNullOrWhiteSpace(cmd.Email))
                throw new ArgumentException("L'email est obligatoire");

            if (string.IsNullOrWhiteSpace(cmd.MotDePasse) || cmd.MotDePasse.Length < 6)
                throw new ArgumentException("Le mot de passe doit faire au moins 6 caractères");

            if (string.IsNullOrWhiteSpace(cmd.Nom) || string.IsNullOrWhiteSpace(cmd.Prenom))
                throw new ArgumentException("Le nom et le prénom sont obligatoires");

            if (string.IsNullOrWhiteSpace(cmd.CabinetNom))
                throw new ArgumentException("Le nom du cabinet est obligatoire");

            // 2. Email déjà utilisé ?
            if (await _userRepo.EmailExisteAsync(cmd.Email))
                throw new InvalidOperationException("Cet email est déjà utilisé");

            // 3. Créer le compte User (Role = Praticien)
            var user = new User
            {
                Email = cmd.Email.Trim().ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(cmd.MotDePasse),
                Role = "Praticien",
                TypeCompte = "Professionnel",
                Telephone = cmd.Telephone
            };
            int userId = await _userRepo.AddAsync(user);

            // 4. Vérifier que la ville existe (validation)
            var ville = await _villeRepo.GetByIdAsync(cmd.VilleId);
            if (ville == null)
                throw new ArgumentException("Ville invalide");

            // 5. Créer le Cabinet (le lieu)
            var cabinet = new Cabinet
            {
                Nom = cmd.CabinetNom.Trim(),
                Type = "Solo",
                Adresse = cmd.Adresse?.Trim() ?? "",
                VilleId = cmd.VilleId,
                Telephone = cmd.Telephone ?? "",
                Abonnement = "Gratuit"
            };
            int cabinetId = await _cabinetRepo.AddAsync(cabinet);

            // 6. Créer le Praticien lié au User ET au Cabinet
            var praticien = new Praticien
            {
                UserId = userId,
                CabinetId = cabinetId,
                SpecialiteId = cmd.SpecialiteId,
                VilleId = cmd.VilleId,
                Nom = cmd.Nom.ToUpper().Trim(),
                Prenom = cmd.Prenom.Trim(),
                Secteur = cmd.Secteur,
                ProfilValide = true,
                AccepteNouveauxPatients = true
            };
            await _praticienRepo.AddAsync(praticien);

            return praticien.Id;
        }
    }
}