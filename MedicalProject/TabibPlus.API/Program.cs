using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using TabibPlus.Application.Interfaces;
using TabibPlus.Application.Patients.CreatePatient;
using TabibPlus.Application.Patients.GetPatients;
using TabibPlus.Application.Praticiens.GetPraticienById;
using TabibPlus.Application.Praticiens.SearchPraticiens;
using TabibPlus.Application.RendezVous.ChangerStatut;
using TabibPlus.Application.RendezVous.CreateRendezVous;
using TabibPlus.Application.RendezVous.GetDisponibilites;
using TabibPlus.Infrastructure.Data;
using TabibPlus.Infrastructure.Repositories;
using TabibPlus.Infrastructure.Services;
using TabibPlus.Application.Auth.RegisterPatient;
using TabibPlus.Application.Auth.RegisterPatient;
using TabibPlus.Application.Interfaces;
using TabibPlus.Application.Auth.RegisterProfessionnel;
using TabibPlus.Application.Reference.GetSpecialites;
using TabibPlus.Application.Reference.GetVilles;
var builder = WebApplication.CreateBuilder(args);

// ── 1. Base de données ────────────────────────────
builder.Services.AddDbContext<TabibPlusDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration
            .GetConnectionString("DefaultConnection")
    )
);

// ── 2. Repositories (Infrastructure) ─────────────
builder.Services
    .AddScoped<IPatientRepository, PatientRepository>();
builder.Services
    .AddScoped<IPraticienRepository, PraticienRepository>();
builder.Services
    .AddScoped<IRendezVousRepository, RendezVousRepository>();
builder.Services
    .AddScoped<ISpecialiteRepository, SpecialiteRepository>();
builder.Services
    .AddScoped<IVilleRepository, VilleRepository>();

// ── 3. Services (Infrastructure) ─────────────────
builder.Services
    .AddScoped<ISmsService, SmsService>();
builder.Services
    .AddScoped<IEmailService, EmailService>();
builder.Services
    .AddScoped<IUserRepository, UserRepository>();
builder.Services
    .AddScoped<ICabinetRepository, CabinetRepository>();

// ── 4. Handlers (Application) ────────────────────
builder.Services.AddScoped<CreatePatientHandler>();
builder.Services.AddScoped<GetPatientsHandler>();
builder.Services.AddScoped<SearchPraticiensHandler>();
builder.Services.AddScoped<GetPraticienByIdHandler>();
builder.Services.AddScoped<CreateRendezVousHandler>();
builder.Services.AddScoped<GetDisponibilitesHandler>();
builder.Services.AddScoped<ChangerStatutHandler>();
builder.Services.AddScoped<RegisterPatientHandler>();
builder.Services.AddScoped<RegisterProfessionnelHandler>();
builder.Services.AddScoped<GetSpecialitesHandler>();
builder.Services.AddScoped<GetVillesHandler>();

// ── 5. JWT ────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey)),
                ValidateIssuer = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = builder.Configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",
        p => p.RequireRole("Admin"));
    options.AddPolicy("Praticien",
        p => p.RequireRole("Admin", "Praticien"));
    options.AddPolicy("Staff",
        p => p.RequireRole("Admin", "Praticien", "Secretaire"));
});



// ── 6. CORS ───────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// ── 7. Controllers + Swagger ──────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();
var app = builder.Build();

// ── 8. Migration automatique ──────────────────────
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider
        .GetRequiredService<TabibPlusDbContext>();
    db.Database.Migrate();
}

// ── 9. Pipeline HTTP ──────────────────────────────
app.MapOpenApi();
app.MapScalarApiReference();
app.UseStaticFiles();   // ← NOUVEAU : sert wwwroot/uploads/xxx.jpg
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();