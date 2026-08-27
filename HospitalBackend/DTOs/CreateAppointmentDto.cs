using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalBackend.DTOs
{
    public class CreateAppointmentDto
    {
        [Required(ErrorMessage = "اسم المريض مطلوب")]
        [StringLength(100, ErrorMessage = "اسم المريض لا يتجاوز 100 حرف")]
        public string PatientName { get; set; } = string.Empty;

        [Required(ErrorMessage = "اسم الطبيب مطلوب")]
        [StringLength(100, ErrorMessage = "اسم الطبيب لا يتجاوز 100 حرف")]
        public string DoctorName { get; set; } = string.Empty;

        [Required(ErrorMessage = "القسم مطلوب")]
        [StringLength(50, ErrorMessage = "اسم القسم لا يتجاوز 50 حرف")]
        public string Department { get; set; } = string.Empty;

        [Required(ErrorMessage = "تاريخ الموعد مطلوب")]
        public DateTime AppointmentDate { get; set; }

        public string? Notes { get; set; }
    }
}