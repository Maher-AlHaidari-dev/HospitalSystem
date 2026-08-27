using Microsoft.AspNetCore.Mvc;
using HospitalBackend.Models;

namespace HospitalBackend.Controllers
{
    [ApiController]
    [Route("api/medical-records")]
    public class MedicalRecordsController : ControllerBase
    {
        private static readonly List<MedicalRecord> Records = new()
        {
            new MedicalRecord { Id = 1, Version = "v2", PatientName = "Ahmed Al-Sayed", DoctorName = "Dr. Sarah Ahmed", Date = DateTime.Now.AddDays(-40), Diagnosis = "Stable hypertension", Prescription = "Amlodipine 5mg" },
            new MedicalRecord { Id = 2, Version = "v1", PatientName = "John Peterson", DoctorName = "Dr. James Miller", Date = DateTime.Now.AddDays(-25), Diagnosis = "Type 2 Diabetes - controlled", Prescription = "Metformin 500mg" }
        };

        [HttpGet]
        public IActionResult GetRecords() => Ok(Records.OrderByDescending(r => r.Id));

        [HttpPost]
        public IActionResult CreateRecord([FromBody] CreateMedicalRecordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.PatientName) || string.IsNullOrWhiteSpace(dto.Diagnosis))
                return BadRequest(new { message = "Required fields missing" });

            var newRecord = new MedicalRecord
            {
                Id = Records.Count + 1,
                Version = "v1",
                PatientName = dto.PatientName,
                DoctorName = dto.DoctorName,
                Diagnosis = dto.Diagnosis,
                Prescription = dto.Prescription,
                Notes = dto.Notes,
                Date = DateTime.UtcNow
            };

            Records.Add(newRecord);
            return CreatedAtAction(nameof(GetRecords), new { id = newRecord.Id }, newRecord);
        }
    }

    // DTO الخاص باستقبال بيانات السجل الطبي الجديد إذا لم يكن معرفاً في ملف منفصل
    public class CreateMedicalRecordDto
    {
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public string Prescription { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
}