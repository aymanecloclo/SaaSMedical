using System.Collections.Generic;

namespace TabibPlus.Application.Praticiens.SearchPraticiens
{
	public record SearchPraticiensResult(
		IEnumerable<PraticienListeDto> Items,
		int TotalCount,
		int Page,
		int Taille,
		int TotalPages
	);
}