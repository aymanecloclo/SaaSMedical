using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TabibPlus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Entite = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Operation = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    EntiteId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Details = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdresseIp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateHeure = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExpediteurId = table.Column<int>(type: "int", nullable: false),
                    DestinataireId = table.Column<int>(type: "int", nullable: false),
                    Contenu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PieceJointeUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Lu = table.Column<bool>(type: "bit", nullable: false),
                    DateEnvoi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Nom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateNaissance = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Telephone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sexe = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GroupeSanguin = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Taille = table.Column<int>(type: "int", nullable: true),
                    Poids = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Allergies = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Antecedents = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Medicaments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroAssurance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeAssurance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactUrgenceNom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactUrgenceTel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConsentementDonne = table.Column<bool>(type: "bit", nullable: false),
                    DateConsentement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Actif = table.Column<bool>(type: "bit", nullable: false),
                    CreeLe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifieLe = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Specialites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomFr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NomAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Categorie = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Secretaire"),
                    TypeCompte = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Patient"),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhotoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Langue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NotificationsEmail = table.Column<bool>(type: "bit", nullable: false),
                    NotificationsSms = table.Column<bool>(type: "bit", nullable: false),
                    Actif = table.Column<bool>(type: "bit", nullable: false),
                    CreeLe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DerniereConnexion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Villes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NomFr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NomAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Region = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Villes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cabinets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ville = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VilleId = table.Column<int>(type: "int", nullable: true),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteWeb = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HorairesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Parking = table.Column<bool>(type: "bit", nullable: false),
                    AccesHandicap = table.Column<bool>(type: "bit", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    NumeroConvention = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Abonnement = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AbonnementExpire = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreeLe = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cabinets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cabinets_Villes_VilleId",
                        column: x => x.VilleId,
                        principalTable: "Villes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Praticiens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CabinetId = table.Column<int>(type: "int", nullable: false),
                    SpecialiteId = table.Column<int>(type: "int", nullable: true),
                    VilleId = table.Column<int>(type: "int", nullable: true),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Inpe = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DureeRdvDefaut = table.Column<int>(type: "int", nullable: false),
                    PhotoProfil = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AnneesExperience = table.Column<int>(type: "int", nullable: false),
                    Langues = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Diplomes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteWeb = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Honoraires = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Secteur = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AccepteTeleconsult = table.Column<bool>(type: "bit", nullable: false),
                    AccepteNouveauxPatients = table.Column<bool>(type: "bit", nullable: false),
                    NoteMoyenne = table.Column<decimal>(type: "decimal(3,2)", nullable: false),
                    NombreAvis = table.Column<int>(type: "int", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    ProfilValide = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Praticiens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Praticiens_Cabinets_CabinetId",
                        column: x => x.CabinetId,
                        principalTable: "Cabinets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Praticiens_Specialites_SpecialiteId",
                        column: x => x.SpecialiteId,
                        principalTable: "Specialites",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Praticiens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Praticiens_Villes_VilleId",
                        column: x => x.VilleId,
                        principalTable: "Villes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PhotosCabinet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PraticienId = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ordre = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhotosCabinet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PhotosCabinet_Praticiens_PraticienId",
                        column: x => x.PraticienId,
                        principalTable: "Praticiens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlagesHoraires",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PraticienId = table.Column<int>(type: "int", nullable: false),
                    JourSemaine = table.Column<int>(type: "int", nullable: false),
                    HeureDebut = table.Column<TimeSpan>(type: "time", nullable: false),
                    HeureFin = table.Column<TimeSpan>(type: "time", nullable: false),
                    Actif = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlagesHoraires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlagesHoraires_Praticiens_PraticienId",
                        column: x => x.PraticienId,
                        principalTable: "Praticiens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RendezVous",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    PraticienId = table.Column<int>(type: "int", nullable: false),
                    CabinetId = table.Column<int>(type: "int", nullable: false),
                    DateHeure = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DureeMinutes = table.Column<int>(type: "int", nullable: false),
                    Motif = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Confirme"),
                    Source = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstTeleconsultation = table.Column<bool>(type: "bit", nullable: false),
                    LienVideo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NotesConsultation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Diagnostic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ordonnance = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MontantHonoraires = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    StatutPaiement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AvisLaisse = table.Column<bool>(type: "bit", nullable: false),
                    CreeLe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifieLe = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RendezVous", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RendezVous_Cabinets_CabinetId",
                        column: x => x.CabinetId,
                        principalTable: "Cabinets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RendezVous_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RendezVous_Praticiens_PraticienId",
                        column: x => x.PraticienId,
                        principalTable: "Praticiens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Avis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    PraticienId = table.Column<int>(type: "int", nullable: false),
                    RendezVousId = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<int>(type: "int", nullable: false),
                    Commentaire = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateAvis = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Visible = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Avis_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Avis_Praticiens_PraticienId",
                        column: x => x.PraticienId,
                        principalTable: "Praticiens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Avis_RendezVous_RendezVousId",
                        column: x => x.RendezVousId,
                        principalTable: "RendezVous",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Rappels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RendezVousId = table.Column<int>(type: "int", nullable: false),
                    Canal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatePrevue = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Envoye = table.Column<bool>(type: "bit", nullable: false),
                    EnvoyeLe = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Erreur = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rappels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rappels_RendezVous_RendezVousId",
                        column: x => x.RendezVousId,
                        principalTable: "RendezVous",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Cabinets",
                columns: new[] { "Id", "Abonnement", "AbonnementExpire", "AccesHandicap", "Adresse", "CreeLe", "Description", "Email", "HorairesJson", "Latitude", "Longitude", "Nom", "NumeroConvention", "Parking", "SiteWeb", "Telephone", "Type", "Ville", "VilleId" },
                values: new object[] { 1, "Premium", null, false, "123 Avenue Mohammed V", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, null, null, "Cabinet Test TabibPlus", null, false, null, "0522000000", "Solo", "Casablanca", null });

            migrationBuilder.InsertData(
                table: "Specialites",
                columns: new[] { "Id", "Categorie", "Icone", "NomAr", "NomFr" },
                values: new object[,]
                {
                    { 1, "Médecine", "🩺", "الطب العام", "Médecine générale" },
                    { 2, "Médecine", "❤️", "أمراض القلب", "Cardiologie" },
                    { 3, "Médecine", "🔬", "الجلدية", "Dermatologie" },
                    { 4, "Médecine", "👶", "أمراض النساء", "Gynécologie" },
                    { 5, "Médecine", "🧒", "طب الأطفال", "Pédiatrie" },
                    { 6, "Médecine", "👁️", "طب العيون", "Ophtalmologie" },
                    { 7, "Dentaire", "🦷", "طب الأسنان", "Dentiste" },
                    { 8, "Médecine", "🦴", "جراحة العظام", "Orthopédie" },
                    { 9, "Mental", "🧠", "الطب النفسي", "Psychiatrie" },
                    { 10, "Paramédical", "💪", "العلاج الطبيعي", "Kinésithérapie" }
                });

            migrationBuilder.InsertData(
                table: "Villes",
                columns: new[] { "Id", "Latitude", "Longitude", "NomAr", "NomFr", "Region" },
                values: new object[,]
                {
                    { 1, 33.573099999999997, -7.5898000000000003, "الدار البيضاء", "Casablanca", "Casablanca-Settat" },
                    { 2, 34.020899999999997, -6.8415999999999997, "الرباط", "Rabat", "Rabat-Salé-Kénitra" },
                    { 3, 31.6295, -7.9810999999999996, "مراكش", "Marrakech", "Marrakech-Safi" },
                    { 4, 34.018099999999997, -5.0077999999999996, "فاس", "Fès", "Fès-Meknès" },
                    { 5, 35.759500000000003, -5.8339999999999996, "طنجة", "Tanger", "Tanger-Tétouan-Al Hoceïma" },
                    { 6, 30.427800000000001, -9.5981000000000005, "أكادير", "Agadir", "Souss-Massa" },
                    { 7, 33.893500000000003, -5.5472999999999999, "مكناس", "Meknès", "Fès-Meknès" },
                    { 8, 34.680500000000002, -1.9076, "وجدة", "Oujda", "Oriental" },
                    { 9, 34.261000000000003, -6.5801999999999996, "القنيطرة", "Kénitra", "Rabat-Salé-Kénitra" },
                    { 10, 35.578499999999998, -5.3684000000000003, "تطوان", "Tétouan", "Tanger-Tétouan-Al Hoceïma" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId_DateHeure",
                table: "AuditLogs",
                columns: new[] { "UserId", "DateHeure" });

            migrationBuilder.CreateIndex(
                name: "IX_Avis_PatientId",
                table: "Avis",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Avis_PraticienId",
                table: "Avis",
                column: "PraticienId");

            migrationBuilder.CreateIndex(
                name: "IX_Avis_RendezVousId",
                table: "Avis",
                column: "RendezVousId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cabinets_VilleId",
                table: "Cabinets",
                column: "VilleId");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_Telephone",
                table: "Patients",
                column: "Telephone");

            migrationBuilder.CreateIndex(
                name: "IX_PhotosCabinet_PraticienId",
                table: "PhotosCabinet",
                column: "PraticienId");

            migrationBuilder.CreateIndex(
                name: "IX_PlagesHoraires_PraticienId",
                table: "PlagesHoraires",
                column: "PraticienId");

            migrationBuilder.CreateIndex(
                name: "IX_Praticiens_CabinetId",
                table: "Praticiens",
                column: "CabinetId");

            migrationBuilder.CreateIndex(
                name: "IX_Praticiens_SpecialiteId",
                table: "Praticiens",
                column: "SpecialiteId");

            migrationBuilder.CreateIndex(
                name: "IX_Praticiens_UserId",
                table: "Praticiens",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Praticiens_VilleId",
                table: "Praticiens",
                column: "VilleId");

            migrationBuilder.CreateIndex(
                name: "IX_Rappels_RendezVousId",
                table: "Rappels",
                column: "RendezVousId");

            migrationBuilder.CreateIndex(
                name: "IX_RendezVous_CabinetId",
                table: "RendezVous",
                column: "CabinetId");

            migrationBuilder.CreateIndex(
                name: "IX_RendezVous_PatientId_DateHeure",
                table: "RendezVous",
                columns: new[] { "PatientId", "DateHeure" });

            migrationBuilder.CreateIndex(
                name: "IX_RendezVous_PraticienId_DateHeure",
                table: "RendezVous",
                columns: new[] { "PraticienId", "DateHeure" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Avis");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "PhotosCabinet");

            migrationBuilder.DropTable(
                name: "PlagesHoraires");

            migrationBuilder.DropTable(
                name: "Rappels");

            migrationBuilder.DropTable(
                name: "RendezVous");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Praticiens");

            migrationBuilder.DropTable(
                name: "Cabinets");

            migrationBuilder.DropTable(
                name: "Specialites");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Villes");
        }
    }
}
