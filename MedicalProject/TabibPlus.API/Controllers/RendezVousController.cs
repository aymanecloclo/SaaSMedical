using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TabibPlus.Application.RendezVous.ChangerStatut;
using TabibPlus.Application.RendezVous.CreateRendezVous;
using TabibPlus.Application.RendezVous.GetAgendaJour;
using TabibPlus.Application.RendezVous.GetAgendaSemaine;
using TabibPlus.Application.RendezVous.GetDisponibilites;
using TabibPlus.Application.RendezVous.GetPraticienStats;
using TabibPlus.Application.RendezVous.GetMesRendezVous;
using TabibPlus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RendezVousController : ControllerBase
    {
        private readonly CreateRendezVousHandler _createHandler;
        private readonly GetDisponibilitesHandler _dispoHandler;
        private readonly ChangerStatutHandler _statutHandler;
        private readonly GetAgendaJourHandler _agendaJourHandler;
        private readonly GetAgendaSemaineHandler _agendaSemaineHandler;
        private readonly GetPraticienStatsHandler _statsHandler;
        private readonly GetMesRendezVousHandler _mesRdvHandler;
        private readonly TabibPlusDbContext _db;

        public RendezVousController(
            CreateRendezVousHandler createHandler,
            GetDisponibilitesHandler dispoHandler,
            ChangerStatutHandler statutHandler,
            GetAgendaJourHandler agendaJourHandler,
            GetAgendaSemaineHandler agendaSemaineHandler,
            GetPraticienStatsHandler statsHandler,
            GetMesRendezVousHandler mesRdvHandler,
            TabibPlusDbContext db)
        {
            _createHandler = createHandler;
            _dispoHandler = dispoHandler;
            _statutHandler = statutHandler;
            _agendaJourHandler = agendaJourHandler;
            _agendaSemaineHandler = agendaSemaineHandler;
            _statsHandler = statsHandler;
            _mesRdvHandler = mesRdvHandler;
            _db = db;
        }

        private int? GetPraticienIdDuToken()
        {
            var claim = User.FindFirst("praticienId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private int? GetPatientIdDuToken()
        {
            var claim = User.FindFirst("patientId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        private int? GetCabinetIdDuToken()
        {
            var claim = User.FindFirst("cabinetId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        [HttpGet("disponibilites")]
        public async Task<IActionResult> GetDisponibilites(
            [FromQuery] int praticienId,
            [FromQuery] DateTime date)
        {
            var result = await _dispoHandler.Handle(
                new GetDisponibilitesQuery(praticienId, date));
            return Ok(result);
        }

        [HttpGet("agenda")]
        [Authorize(Policy = "Praticien")]
        public async Task<IActionResult> GetAgenda([FromQuery] DateTime date)
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var result = await _agendaJourHandler.Handle(
                new GetAgendaJourQuery(praticienId.Value, date));
            return Ok(result);
        }

        [HttpGet("agenda-semaine")]
        [Authorize(Policy = "Praticien")]
        public async Task<IActionResult> GetAgendaSemaine([FromQuery] DateTime dateDebut)
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var result = await _agendaSemaineHandler.Handle(
                new GetAgendaSemaineQuery(praticienId.Value, dateDebut));
            return Ok(result);
        }

        [HttpGet("stats")]
        [Authorize(Policy = "Praticien")]
        public async Task<IActionResult> GetStats()
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var result = await _statsHandler.Handle(
                new GetPraticienStatsQuery(praticienId.Value));
            return Ok(result);
        }

        [HttpGet("mes-rendezvous")]
        [Authorize]
        public async Task<IActionResult> GetMesRendezVous([FromQuery] bool aVenir = true)
        {
            var patientId = GetPatientIdDuToken();
            if (patientId == null)
                return Forbid();

            var result = await _mesRdvHandler.Handle(
                new GetMesRendezVousQuery(patientId.Value, aVenir));
            return Ok(result);
        }

        // ── POST /api/rendezvous ──
        // Utilisé par : le patient (réservation en ligne) ET la secrétaire (walk-in/téléphone)
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateRendezVousCommand cmd)
        {
            // Vérifie que le praticien demandé appartient bien au cabinet indiqué —
            // protège contre une incohérence (accidentelle ou volontaire) entre praticienId et cabinetId
            var praticien = await _db.Praticiens.FindAsync(cmd.PraticienId);
            if (praticien == null)
                return BadRequest(new { message = "Praticien introuvable" });

            if (praticien.CabinetId != cmd.CabinetId)
                return BadRequest(new { message = "Ce praticien n'appartient pas à ce cabinet" });

            // Si c'est une secrétaire qui crée le RDV, elle ne peut agir QUE
            // pour les praticiens de SON PROPRE cabinet — jamais un autre
            if (User.IsInRole("Secretaire"))
            {
                var cabinetIdSecretaire = GetCabinetIdDuToken();
                if (cabinetIdSecretaire == null || praticien.CabinetId != cabinetIdSecretaire.Value)
                    return Forbid();
            }

            try
            {
                var id = await _createHandler.Handle(cmd);
                return CreatedAtAction(
                    nameof(GetById),
                    new { id },
                    new { id, message = "RDV créé avec succès" }
                );
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/statut")]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> ChangerStatut(
            int id,
            [FromBody] ChangerStatutCommand cmd)
        {
            try
            {
                await _statutHandler.Handle(
                    new ChangerStatutCommand(id, cmd.NouveauStatut, cmd.Notes));
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/annuler")]
        [Authorize]
        public async Task<IActionResult> Annuler(int id)
        {
            var patientId = GetPatientIdDuToken();
            if (patientId == null)
                return Forbid();

            var rdv = await _db.RendezVous.FindAsync(id);
            if (rdv == null)
                return NotFound(new { message = "RDV introuvable" });

            if (rdv.PatientId != patientId.Value)
                return Forbid();

            try
            {
                await _statutHandler.Handle(new ChangerStatutCommand(id, "Annule", null));
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var rdv = await _db.RendezVous
                .Include(r => r.Patient)
                .Include(r => r.Praticien)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rdv == null)
                return NotFound(new { message = "RDV introuvable" });

            return Ok(rdv);
        }
    }
}
