using System;
using System.Threading.Tasks;
using TabibPlus.Application.Interfaces;
using TabibPlus.Core.Entities;

namespace TabibPlus.Application.RendezVous.CreateRendezVous
{
    public class CreateRendezVousHandler
    {
        private readonly IRendezVousRepository _repo;
        private readonly ISmsService _sms;
        private readonly IEmailService _email;

        public CreateRendezVousHandler(
            IRendezVousRepository repo,
            ISmsService sms,
            IEmailService email)
        {
            _repo = repo;
            _sms = sms;
            _email = email;
        }

        public async Task<int> Handle(CreateRendezVousCommand cmd)
        {
            // 1. Vérifier que le créneau est libre
            bool libre = await _repo.CreneauEstLibreAsync(
                cmd.PraticienId, cmd.DateHeure);

            if (!libre)
                throw new InvalidOperationException(
                    "Ce créneau est déjà réservé");

            // 2. Créer le rendez-vous
            var rdv = new Core.Entities.RendezVous
            {
                PatientId = cmd.PatientId,
                PraticienId = cmd.PraticienId,
                CabinetId = cmd.CabinetId,
                DateHeure = cmd.DateHeure,
                DureeMinutes = cmd.DureeMinutes,
                Motif = cmd.Motif,
                EstTeleconsultation = cmd.EstTeleconsultation,
                Source = cmd.Source,
                Statut = "Confirme"
            };

            await _repo.AddAsync(rdv);
            return rdv.Id;
        }
    }
}