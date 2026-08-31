namespace HospitalBackend.Models
{
    // تعريف الـ DTO مرة واحدة وبصيغة صحيحة
    public record CreateMedicalRecordDto(
        string PatientName, 
        string DoctorName, 
        string Diagnosis, 
        string Prescription, 
        string? Notes
    );

    public class MedicalRecord
    {
        public int Id { get; set; }
        public string Version { get; set; } = "v1";
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Diagnosis { get; set; } = string.Empty;
        public string Prescription { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}