using System;

namespace TabibPlus.Application.Auth.RegisterPatient
{
	public record RegisterPatientCommand(
		string Email,
		string MotDePasse,
		string Nom,
		string Prenom,
		string Telephone,
		DateTime DateNaissance,
		string Sexe,
		bool ConsentementDonne
	);
}