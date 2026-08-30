using Microsoft.EntityFrameworkCore;
using HospitalBackend.Models;

namespace HospitalBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // تعيين أسماء الجداول بحروف صغيرة صراحة لضمان توافقها التام مع MySQL على لينكس (Railway)
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<Patient>().ToTable("patients");
            modelBuilder.Entity<Appointment>().ToTable("appointments");
            modelBuilder.Entity<Invoice>().ToTable("invoices");
            modelBuilder.Entity<MedicalRecord>().ToTable("medicalrecords");
        }
    }
}