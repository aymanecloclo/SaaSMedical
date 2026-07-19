using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TabibPlus.Core.Entities;
using TabibPlus.Infrastructure.Data;
using TabibPlus.Application.Auth.RegisterPatient;
using TabibPlus.Application.Auth.RegisterProfessionnel;
using TabibPlus.Application.Auth.RegisterSecretaire;

namespace TabibPlus.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TabibPlusDbContext _db;
        private readonly IConfiguration _config;
        private readonly RegisterPatientHandler _registerPatientHandler;
        private readonly RegisterProfessionnelHandler _registerProfessionnelHandler;
        private readonly RegisterSecretaireHandler _registerSecretaireHandler;

        public AuthController(
            TabibPlusDbContext db,
            IConfiguration config,
            RegisterPatientHandler registerPatientHandler,
            RegisterProfessionnelHandler registerProfessionnelHandler,
            RegisterSecretaireHandler registerSecretaireHandler)
        {
            _db = db;
            _config = config;
            _registerPatientHandler = registerPatientHandler;
            _registerProfessionnelHandler = registerProfessionnelHandler;
            _registerSecretaireHandler = registerSecretaireHandler;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users
                .Include(u => u.Praticien)
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Actif);

            if (user == null)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });

            bool valide = BCrypt.Net.BCrypt.Verify(dto.MotDePasse, user.PasswordHash);
            if (!valide)
                return Unauthorized(new { message = "Email ou mot de passe incorrect" });

            var patient = await _db.Patients
                .FirstOrDefaultAsync(p => p.UserId == user.Id && p.Actif);

            user.DerniereConnexion = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            var token = GenererToken(user, patient?.Id);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.Role,
                    praticienId = user.Praticien?.Id,
                    patientId = patient?.Id,
                    cabinetId = user.CabinetId,
                    photoUrl = user.Praticien?.PhotoProfil,
                    nom = user.Praticien != null
                        ? $"Dr. {user.Praticien.Prenom} {user.Praticien.Nom}"
                        : patient != null
                            ? $"{patient.Prenom} {patient.Nom}"
                            : user.Email
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Cet email est déjà utilisé" });

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.MotDePasse),
                Role = dto.Role ?? "Secretaire"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Compte créé avec succès", userId = user.Id });
        }

        [HttpPost("register/patient")]
        public async Task<IActionResult> RegisterPatient([FromBody] RegisterPatientCommand cmd)
        {
            try
            {
                var userId = await _registerPatientHandler.Handle(cmd);
                return Ok(new { message = "Compte patient créé avec succès", userId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPost("register/professionnel")]
        public async Task<IActionResult> RegisterProfessionnel([FromBody] RegisterProfessionnelCommand cmd)
        {
            try
            {
                var praticienId = await _registerProfessionnelHandler.Handle(cmd);
                return Ok(new { message = "Compte professionnel créé avec succès", praticienId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // ── POST /api/auth/register-secretaire ──
        // Réservé aux praticiens connectés — ils inscrivent LEUR secrétaire.
        // CabinetId n'est JAMAIS pris depuis le body : il est déduit du cabinet
        // du praticien qui fait la demande, via son propre JWT.
        [HttpPost("register-secretaire")]
        [Authorize(Policy = "Praticien")]
        public async Task<IActionResult> RegisterSecretaire([FromBody] RegisterSecretaireCommand dto)
        {
            var praticienIdClaim = User.FindFirst("praticienId")?.Value;
            if (!int.TryParse(praticienIdClaim, out var praticienId))
                return Forbid();

            var praticien = await _db.Praticiens.FindAsync(praticienId);
            if (praticien == null)
                return Forbid();

            // On ignore tout CabinetId envoyé par le client — on force celui du praticien
            var cmdSecurise = dto with { CabinetId = praticien.CabinetId };

            try
            {
                var userId = await _registerSecretaireHandler.Handle(cmdSecurise);
                return Ok(new { message = "Compte secrétaire créé avec succès", userId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        private string GenererToken(User user, int? patientId)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("praticienId", user.Praticien?.Id.ToString() ?? ""),
                new Claim("patientId", patientId?.ToString() ?? ""),
                new Claim("cabinetId", user.CabinetId?.ToString() ?? "")
            };

            var expiration = int.Parse(_config["Jwt:ExpirationHours"] ?? "8");
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public record LoginDto(string Email, string MotDePasse);
    public record RegisterDto(string Email, string MotDePasse, string? Role);
}
