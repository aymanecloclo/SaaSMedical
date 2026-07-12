using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TabibPlus.Application.Patients.CreatePatient;
using TabibPlus.Application.Patients.GetPatients;
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
        private readonly TabibPlusDbContext _db;

        public PatientsController(
            GetPatientsHandler getHandler,
            CreatePatientHandler createHandler,
            TabibPlusDbContext db)
        {
            _getHandler = getHandler;
            _createHandler = createHandler;
            _db = db;
        }

        // ── GET /api/patients?q=ahmed
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? q)
        {
            var result = await _getHandler
                .Handle(new GetPatientsQuery(q));
            return Ok(result);
        }

        // ── POST /api/patients
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreatePatientCommand cmd)
        {
            try
            {
                var id = await _createHandler.Handle(cmd);
                return CreatedAtAction(
                    nameof(GetById),
                    new { id },
                    new { id, message = "Patient créé avec succès" }
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ── GET /api/patients/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var patient = await _db.Patients
                .FindAsync(id);

            if (patient == null || !patient.Actif)
                return NotFound(new
                {
                    message = "Patient introuvable"
                });

            return Ok(patient);
        }
    }
}