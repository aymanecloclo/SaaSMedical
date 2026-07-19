using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TabibPlus.Application.Interfaces;
using TabibPlus.Application.RendezVous.GetAgendaJour;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/secretaire")]
    [Authorize(Policy = "Staff")]
    public class SecretaireController : ControllerBase
    {
        private readonly IPraticienRepository _praticienRepo;
        private readonly GetAgendaJourHandler _agendaJourHandler;
        private readonly TabibPlusDbContext _db;

        public SecretaireController(
            IPraticienRepository praticienRepo,
            GetAgendaJourHandler agendaJourHandler,
            TabibPlusDbContext db)
        {
            _praticienRepo = praticienRepo;
            _agendaJourHandler = agendaJourHandler;
            _db = db;
        }

        private int? GetCabinetIdDuToken()
        {
            var claim = User.FindFirst("cabinetId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        [HttpGet("praticiens")]
        public async Task<IActionResult> GetPraticiensDuCabinet()
        {
            var cabinetId = GetCabinetIdDuToken();
            if (cabinetId == null)
                return Forbid();

            var praticiens = await _praticienRepo.GetByCabinetAsync(cabinetId.Value);

            var result = praticiens.Select(p => new
            {
                p.Id,
                p.CabinetId,
                NomComplet = $"Dr. {p.Prenom} {p.Nom}",
                Specialite = p.Specialite?.NomFr ?? "",
                p.PhotoProfil,
                Telephone = p.User?.Telephone,
                p.Bio,
                p.AnneesExperience,
                p.Langues,
                p.Honoraires,
                p.Secteur,
                p.AccepteTeleconsult,
                p.AccepteNouveauxPatients,
                p.NoteMoyenne,
                p.NombreAvis
            });

            return Ok(result);
        }

        [HttpGet("agenda")]
        public async Task<IActionResult> GetAgendaPraticien(
            [FromQuery] int praticienId,
            [FromQuery] DateTime date)
        {
            var cabinetId = GetCabinetIdDuToken();
            if (cabinetId == null)
                return Forbid();

            var praticien = await _db.Praticiens
                .FirstOrDefaultAsync(p => p.Id == praticienId);

            if (praticien == null)
                return NotFound(new { message = "Praticien introuvable" });

            if (praticien.CabinetId != cabinetId.Value)
                return Forbid();

            var result = await _agendaJourHandler.Handle(
                new GetAgendaJourQuery(praticienId, date));

            return Ok(result);
        }

        [HttpGet("collegues")]
        public async Task<IActionResult> GetCollegues()
        {
            var cabinetId = GetCabinetIdDuToken();
            if (cabinetId == null)
                return Forbid();

            var secretaires = await _db.Users
                .Where(u => u.CabinetId == cabinetId.Value && u.Role == "Secretaire" && u.Actif)
                .Select(u => new
                {
                    u.Id,
                    u.Nom,
                    u.Prenom,
                    u.Email,
                    u.Telephone
                })
                .ToListAsync();

            return Ok(secretaires);
        }
    }
}
