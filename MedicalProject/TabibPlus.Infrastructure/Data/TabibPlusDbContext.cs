using Microsoft.EntityFrameworkCore;
using System;
using TabibPlus.Core.Entities;

namespace TabibPlus.Infrastructure.Data
{
    public class TabibPlusDbContext : DbContext
    {
        public TabibPlusDbContext(
            DbContextOptions<TabibPlusDbContext> options)
            : base(options) { }

        // ── Tables ──────────────────────────────────
        public DbSet<User> Users => Set<User>();
        public DbSet<Patient> Patients => Set<Patient>();
        public DbSet<Cabinet> Cabinets => Set<Cabinet>();
        public DbSet<Praticien> Praticiens => Set<Praticien>();
        public DbSet<PlageHoraire> PlagesHoraires => Set<PlageHoraire>();
        public DbSet<RendezVous> RendezVous => Set<RendezVous>();
        public DbSet<Rappel> Rappels => Set<Rappel>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<Avis> Avis => Set<Avis>();
        public DbSet<Specialite> Specialites => Set<Specialite>();
        public DbSet<Ville> Villes => Set<Ville>();
        public DbSet<PhotoCabinet> PhotosCabinet => Set<PhotoCabinet>();
        public DbSet<Message> Messages => Set<Message>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ── User ────────────────────────────────
            builder.Entity<User>(e =>
            {
                e.HasIndex(u => u.Email).IsUnique();
                e.Property(u => u.Role)
                    .HasDefaultValue("Secretaire")
                    .HasMaxLength(20);
                e.Property(u => u.TypeCompte)
                    .HasDefaultValue("Patient")
                    .HasMaxLength(20);
            });
            // ── Cabinet ──────────────────────────────────────────
            builder.Entity<Cabinet>(e =>
            {
                e.HasOne(c => c.Ville)
                    .WithMany(v => v.Cabinets)
                    .HasForeignKey(c => c.VilleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            // ── Patient ─────────────────────────────
            builder.Entity<Patient>(e =>
            {
                e.Property(p => p.Nom)
                    .HasMaxLength(100).IsRequired();
                e.Property(p => p.Prenom)
                    .HasMaxLength(100).IsRequired();
                e.Property(p => p.Telephone)
                    .HasMaxLength(20);
                e.HasIndex(p => p.Telephone);
            });

            // ── Praticien ────────────────────────────
            builder.Entity<Praticien>(e =>
            {
                e.HasOne(p => p.User)
                    .WithOne(u => u.Praticien)
                    .HasForeignKey<Praticien>(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(p => p.Cabinet)
                    .WithMany(c => c.Praticiens)
                    .HasForeignKey(p => p.CabinetId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.Property(p => p.Honoraires)
                    .HasColumnType("decimal(10,2)");
                e.Property(p => p.NoteMoyenne)
                    .HasColumnType("decimal(3,2)");
            });

            // ── RendezVous ───────────────────────────
            builder.Entity<RendezVous>(e =>
            {
                e.Property(r => r.Statut)
                    .HasMaxLength(20)
                    .HasDefaultValue("Confirme");

                e.HasOne(r => r.Patient)
                    .WithMany(p => p.RendezVous)
                    .HasForeignKey(r => r.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(r => r.Praticien)
                    .WithMany(p => p.RendezVous)
                    .HasForeignKey(r => r.PraticienId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(r => r.Avis)
                    .WithOne(a => a.RendezVous)
                    .HasForeignKey<Avis>(a => a.RendezVousId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Index pour les requêtes agenda
                e.HasIndex(r => new
                { r.PraticienId, r.DateHeure });
                e.HasIndex(r => new
                { r.PatientId, r.DateHeure });
            });

            // ── Avis ─────────────────────────────────
            builder.Entity<Avis>(e =>
            {
                e.HasOne(a => a.Patient)
                    .WithMany(p => p.Avis)
                    .HasForeignKey(a => a.PatientId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(a => a.Praticien)
                    .WithMany(p => p.Avis)
                    .HasForeignKey(a => a.PraticienId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── PhotoCabinet ─────────────────────────
            builder.Entity<PhotoCabinet>(e =>
            {
                e.HasOne(p => p.Praticien)
                    .WithMany(p => p.Photos)
                    .HasForeignKey(p => p.PraticienId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ── AuditLog ─────────────────────────────
            builder.Entity<AuditLog>(e =>
            {
                e.Property(a => a.Entite)
                    .HasMaxLength(50).IsRequired();
                e.Property(a => a.Operation)
                    .HasMaxLength(20).IsRequired();
                e.HasIndex(a => new
                { a.UserId, a.DateHeure });
            });

            // ── Seed : Villes marocaines ──────────────
            builder.Entity<Ville>().HasData(
                new Ville { Id = 1, NomFr = "Casablanca", NomAr = "الدار البيضاء", Region = "Casablanca-Settat", Latitude = 33.5731, Longitude = -7.5898 },
                new Ville { Id = 2, NomFr = "Rabat", NomAr = "الرباط", Region = "Rabat-Salé-Kénitra", Latitude = 34.0209, Longitude = -6.8416 },
                new Ville { Id = 3, NomFr = "Marrakech", NomAr = "مراكش", Region = "Marrakech-Safi", Latitude = 31.6295, Longitude = -7.9811 },
                new Ville { Id = 4, NomFr = "Fès", NomAr = "فاس", Region = "Fès-Meknès", Latitude = 34.0181, Longitude = -5.0078 },
                new Ville { Id = 5, NomFr = "Tanger", NomAr = "طنجة", Region = "Tanger-Tétouan-Al Hoceïma", Latitude = 35.7595, Longitude = -5.8340 },
                new Ville { Id = 6, NomFr = "Agadir", NomAr = "أكادير", Region = "Souss-Massa", Latitude = 30.4278, Longitude = -9.5981 },
                new Ville { Id = 7, NomFr = "Meknès", NomAr = "مكناس", Region = "Fès-Meknès", Latitude = 33.8935, Longitude = -5.5473 },
                new Ville { Id = 8, NomFr = "Oujda", NomAr = "وجدة", Region = "Oriental", Latitude = 34.6805, Longitude = -1.9076 },
                new Ville { Id = 9, NomFr = "Kénitra", NomAr = "القنيطرة", Region = "Rabat-Salé-Kénitra", Latitude = 34.2610, Longitude = -6.5802 },
                new Ville { Id = 10, NomFr = "Tétouan", NomAr = "تطوان", Region = "Tanger-Tétouan-Al Hoceïma", Latitude = 35.5785, Longitude = -5.3684 }
            );

            // ── Seed : Spécialités médicales ──────────
            builder.Entity<Specialite>().HasData(
                new Specialite { Id = 1, NomFr = "Médecine générale", NomAr = "الطب العام", Icone = "🩺", Categorie = "Médecine" },
                new Specialite { Id = 2, NomFr = "Cardiologie", NomAr = "أمراض القلب", Icone = "❤️", Categorie = "Médecine" },
                new Specialite { Id = 3, NomFr = "Dermatologie", NomAr = "الجلدية", Icone = "🔬", Categorie = "Médecine" },
                new Specialite { Id = 4, NomFr = "Gynécologie", NomAr = "أمراض النساء", Icone = "👶", Categorie = "Médecine" },
                new Specialite { Id = 5, NomFr = "Pédiatrie", NomAr = "طب الأطفال", Icone = "🧒", Categorie = "Médecine" },
                new Specialite { Id = 6, NomFr = "Ophtalmologie", NomAr = "طب العيون", Icone = "👁️", Categorie = "Médecine" },
                new Specialite { Id = 7, NomFr = "Dentiste", NomAr = "طب الأسنان", Icone = "🦷", Categorie = "Dentaire" },
                new Specialite { Id = 8, NomFr = "Orthopédie", NomAr = "جراحة العظام", Icone = "🦴", Categorie = "Médecine" },
                new Specialite { Id = 9, NomFr = "Psychiatrie", NomAr = "الطب النفسي", Icone = "🧠", Categorie = "Mental" },
                new Specialite { Id = 10, NomFr = "Kinésithérapie", NomAr = "العلاج الطبيعي", Icone = "💪", Categorie = "Paramédical" }
            );

            // ── Seed : Cabinet de test ────────────────
            builder.Entity<Cabinet>().HasData(new Cabinet
            {
                Id = 1,
                Nom = "Cabinet Test TabibPlus",
                Type = "Solo",
                Adresse = "123 Avenue Mohammed V",
                VilleId = 1,
                Telephone = "0522000000",
                Abonnement = "Premium",
                CreeLe = new DateTime(2025, 1, 1)
            });
        }
    }
}