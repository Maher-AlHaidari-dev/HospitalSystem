using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalBackend.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string PatientName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string DoctorName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Department { get; set; } = string.Empty;

        [Required]
        public DateTime AppointmentDate { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "مؤكد";

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}