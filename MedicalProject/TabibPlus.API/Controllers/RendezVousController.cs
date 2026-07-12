using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TabibPlus.Application.RendezVous.ChangerStatut;
using TabibPlus.Application.RendezVous.CreateRendezVous;
using TabibPlus.Application.RendezVous.GetDisponibilites;
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
        private readonly TabibPlusDbContext _db;

        public RendezVousController(
            CreateRendezVousHandler createHandler,
            GetDisponibilitesHandler dispoHandler,
            ChangerStatutHandler statutHandler,
            TabibPlusDbContext db)
        {
            _createHandler = createHandler;
            _dispoHandler = dispoHandler;
            _statutHandler = statutHandler;
            _db = db;
        }

        // ── GET /api/rendezvous/disponibilites?praticienId=1&date=2025-06-01
        // Public — le patient voit les créneaux libres
        [HttpGet("disponibilites")]
        public async Task<IActionResult> GetDisponibilites(
            [FromQuery] int praticienId,
            [FromQuery] DateTime date)
        {
            var result = await _dispoHandler.Handle(
                new GetDisponibilitesQuery(praticienId, date));
            return Ok(result);
        }

        // ── GET /api/rendezvous?praticienId=1&date=2025-06-01
        // Privé — agenda du praticien
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAgenda(
            [FromQuery] int praticienId,
            [FromQuery] DateTime date)
        {
            var rdvs = await _db.RendezVous
                .Include(r => r.Patient)
                .Where(r =>
                    r.PraticienId == praticienId &&
                    r.DateHeure.Date == date.Date &&
                    r.Statut != "Annule")
                .OrderBy(r => r.DateHeure)
                .Select(r => new
                {
                    r.Id,
                    r.DateHeure,
                    r.DureeMinutes,
                    r.Motif,
                    r.Statut,
                    r.EstTeleconsultation,
                    r.Source,
                    patient = new
                    {
                        r.Patient.Id,
                        r.Patient.Nom,
                        r.Patient.Prenom,
                        r.Patient.Telephone,
                        r.Patient.Allergies
                    }
                })
                .ToListAsync();

            return Ok(rdvs);
        }

        // ── POST /api/rendezvous
        // Réserver un RDV
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(
            [FromBody] CreateRendezVousCommand cmd)
        {
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

        // ── PUT /api/rendezvous/{id}/statut
        // Changer statut : Arrivé, En consultation, Terminé...
        [HttpPut("{id}/statut")]
        [Authorize]
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

        // ── GET /api/rendezvous/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var rdv = await _db.RendezVous
                .Include(r => r.Patient)
                .Include(r => r.Praticien)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rdv == null)
                return NotFound(new
                {
                    message = "RDV introuvable"
                });

            return Ok(rdv);
        }
    }
}