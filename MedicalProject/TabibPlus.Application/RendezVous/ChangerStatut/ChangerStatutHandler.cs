using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;

namespace TabibPlus.Application.RendezVous.ChangerStatut
{
    public class ChangerStatutHandler
    {
        private readonly IRendezVousRepository _repo;

        public ChangerStatutHandler(IRendezVousRepository repo)
            => _repo = repo;

        public async Task Handle(ChangerStatutCommand cmd)
        {
            var statutsValides = new[]
            {
                "Confirme", "Arrive", "EnConsultation",
                "Termine", "Absent", "Reporte", "Annule"
            };

            if (!statutsValides.Contains(cmd.NouveauStatut))
                throw new ArgumentException("Statut invalide");

            var rdv = await _repo.GetByIdAsync(cmd.RendezVousId);

            if (rdv == null)
                throw new KeyNotFoundException("RDV introuvable");

            rdv.Statut = cmd.NouveauStatut;
            rdv.ModifieLe = DateTime.UtcNow;

            if (cmd.Notes != null)
                rdv.NotesConsultation = cmd.Notes;

            await _repo.UpdateAsync(rdv);
        }
    }
}