using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/praticien")]
    [Authorize(Policy = "Praticien")]
    public class PraticienController : ControllerBase
    {
        private readonly TabibPlusDbContext _db;

        public PraticienController(TabibPlusDbContext db)
            => _db = db;

        private int? GetPraticienIdDuToken()
        {
            var claim = User.FindFirst("praticienId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ── GET /api/praticien/secretaires ──
        // Liste des secrétaires du cabinet du praticien connecté
        [HttpGet("secretaires")]
        public async Task<IActionResult> GetMesSecretaires()
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var praticien = await _db.Praticiens.FindAsync(praticienId.Value);
            if (praticien == null)
                return NotFound();

            var secretaires = await _db.Users
                .Where(u => u.CabinetId == praticien.CabinetId && u.Role == "Secretaire" && u.Actif)
                .Select(u => new
                {
                    u.Id,
                    u.Nom,
                    u.Prenom,
                    u.Email,
                    u.Telephone,
                    u.CreeLe
                })
                .ToListAsync();

            return Ok(secretaires);
        }

        // ── GET /api/praticien/mon-cabinet ──
        // Infos détaillées du cabinet + du praticien lui-même
        [HttpGet("mon-cabinet")]
        public async Task<IActionResult> GetMonCabinet()
        {
            var praticienId = GetPraticienIdDuToken();
            if (praticienId == null)
                return Forbid();

            var praticien = await _db.Praticiens
                .Include(p => p.Cabinet)
                    .ThenInclude(c => c.Ville)
                .Include(p => p.Specialite)
                .FirstOrDefaultAsync(p => p.Id == praticienId.Value);

            if (praticien == null)
                return NotFound();

            return Ok(new
            {
                Praticien = new
                {
                    praticien.Id,
                    praticien.Nom,
                    praticien.Prenom,
                    praticien.PhotoProfil,
                    Specialite = praticien.Specialite?.NomFr ?? "",
                    praticien.Bio,
                    praticien.AnneesExperience,
                    praticien.Honoraires,
                    praticien.Secteur
                },
                Cabinet = new
                {
                    praticien.Cabinet.Id,
                    praticien.Cabinet.Nom,
                    praticien.Cabinet.Adresse,
                    Ville = praticien.Cabinet.Ville?.NomFr ?? "",
                    praticien.Cabinet.Telephone
                }
            });
        }
    }
}
