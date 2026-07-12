using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.Auth.RegisterPatient
{
	public class RegisterPatientHandler
	{
		private readonly IUserRepository _userRepo;
		private readonly IPatientRepository _patientRepo;

		public RegisterPatientHandler(
			IUserRepository userRepo,
			IPatientRepository patientRepo)
		{
			_userRepo = userRepo;
			_patientRepo = patientRepo;
		}

		public async Task<int> Handle(RegisterPatientCommand cmd)
		{
			// 1. Validations métier
			if (string.IsNullOrWhiteSpace(cmd.Email))
				throw new ArgumentException("L'email est obligatoire");

			if (string.IsNullOrWhiteSpace(cmd.MotDePasse) || cmd.MotDePasse.Length < 6)
				throw new ArgumentException("Le mot de passe doit faire au moins 6 caractères");

			if (string.IsNullOrWhiteSpace(cmd.Nom))
				throw new ArgumentException("Le nom est obligatoire");

			if (!cmd.ConsentementDonne)
				throw new ArgumentException("Le consentement CNDP est obligatoire");

			// 2. Email déjà utilisé ?
			if (await _userRepo.EmailExisteAsync(cmd.Email))
				throw new InvalidOperationException("Cet email est déjà utilisé");

			// 3. Créer le compte User (avec mot de passe hashé)
			var user = new User
			{
				Email = cmd.Email.Trim().ToLower(),
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(cmd.MotDePasse),
				Role = "Patient",
				TypeCompte = "Patient",
				Telephone = cmd.Telephone
			};
			int userId = await _userRepo.AddAsync(user);

			// 4. Créer le Patient lié à ce User
			var patient = new Patient
			{
				UserId = userId,
				Nom = cmd.Nom.ToUpper().Trim(),
				Prenom = cmd.Prenom.Trim(),
				Telephone = cmd.Telephone,
				Email = user.Email,
				DateNaissance = cmd.DateNaissance,
				Sexe = cmd.Sexe,
				ConsentementDonne = cmd.ConsentementDonne,
				DateConsentement = DateTime.UtcNow
			};
			await _patientRepo.AddAsync(patient);

			return userId;
		}
	}
}