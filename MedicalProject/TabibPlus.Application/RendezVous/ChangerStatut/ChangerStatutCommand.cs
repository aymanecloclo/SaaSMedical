namespace TabibPlus.Application.RendezVous.ChangerStatut
{
	public record ChangerStatutCommand(
		int RendezVousId,
		string NouveauStatut,
		string? Notes
	);
}