using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TabibPlus.Application.Patients.CreatePatient;
using TabibPlus.Application.Patients.GetPatients;
using TabibPlus.Application.Patients.GetMonProfil;
using TabibPlus.Application.Patients.UpdateMonProfil;
using TabibPlus.Infrastructure.Data;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly GetPatientsHandler _getHandler;
        private readonly CreatePatientHandler _createHandler;
        private readonly GetMonProfilHandler _monProfilHandler;
        private readonly UpdateMonProfilHandler _updateProfilHandler;
        private readonly TabibPlusDbContext _db;

        public PatientsController(
            GetPatientsHandler getHandler,
            CreatePatientHandler createHandler,
            GetMonProfilHandler monProfilHandler,
            UpdateMonProfilHandler updateProfilHandler,
            TabibPlusDbContext db)
        {
            _getHandler = getHandler;
            _createHandler = createHandler;
            _monProfilHandler = monProfilHandler;
            _updateProfilHandler = updateProfilHandler;
            _db = db;
        }

        private int? GetPatientIdDuToken()
        {
            var claim = User.FindFirst("patientId")?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        // ── GET /api/patients?q=ahmed ──
        [HttpGet]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> GetAll([FromQuery] string? q)
        {
            var result = await _getHandler.Handle(new GetPatientsQuery(q));
            return Ok(result);
        }

        // ── POST /api/patients ──
        [HttpPost]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> Create([FromBody] CreatePatientCommand cmd)
        {
            try
            {
                var id = await _createHandler.Handle(cmd);
                return CreatedAtAction(nameof(GetById), new { id },
                    new { id, message = "Patient créé avec succès" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ── GET /api/patients/me ──
        // Le patient connecté consulte SON PROPRE profil (patientId lu du JWT)
        [HttpGet("me")]
        public async Task<IActionResult> GetMonProfil()
        {
            var patientId = GetPatientIdDuToken();
            if (patientId == null)
                return Forbid();

            var result = await _monProfilHandler.Handle(new GetMonProfilQuery(patientId.Value));
            if (result == null)
                return NotFound(new { message = "Profil introuvable" });

            return Ok(result);
        }

        // ── PUT /api/patients/me ──
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMonProfil([FromBody] UpdateMonProfilCommand cmd)
        {
            var patientId = GetPatientIdDuToken();
            if (patientId == null)
                return Forbid();

            // Ignore le PatientId envoyé par le client — on force celui du JWT
            var cmdSecurise = cmd with { PatientId = patientId.Value };

            try
            {
                await _updateProfilHandler.Handle(cmdSecurise);
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

        // ── GET /api/patients/{id} ──
        [HttpGet("{id}")]
        [Authorize(Policy = "Staff")]
        public async Task<IActionResult> GetById(int id)
        {
            var patient = await _db.Patients.FindAsync(id);
            if (patient == null || !patient.Actif)
                return NotFound(new { message = "Patient introuvable" });

            return Ok(patient);
        }
    }
}
