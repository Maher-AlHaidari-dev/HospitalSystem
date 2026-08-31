using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HospitalBackend.Models;

namespace HospitalBackend.Controllers
{
    [Authorize] // [حماية أمنية]: السجلات الطبية سرية للغاية ولا يُسمح بالاطلاع عليها أو تعديلها دون مصادقة
    [ApiController]
    [Route("api/medical-records")]
    public class MedicalRecordsController : ControllerBase
    {
        private static readonly List<MedicalRecord> Records = new()
        {
            new MedicalRecord { Id = 1, Version = "v2", PatientName = "Ahmed Al-Sayed", DoctorName = "Dr. Sarah Ahmed", Date = DateTime.Now.AddDays(-40), Diagnosis = "Stable hypertension", Prescription = "Amlodipine 5mg" },
            new MedicalRecord { Id = 2, Version = "v1", PatientName = "John Peterson", DoctorName = "Dr. James Miller", Date = DateTime.Now.AddDays(-25), Diagnosis = "Type 2 Diabetes - controlled", Prescription = "Metformin 500mg" }
        };

        // [حماية برمجية]: كائن قفل لضمان سلامة البيانات ومنع أخطاء التزامن (Thread Safety)
        private static readonly object _lock = new();

        [HttpGet]
        public IActionResult GetRecords()
        {
            try
            {
                lock (_lock)
                {
                    var sortedRecords = Records.OrderByDescending(r => r.Id).ToList();
                    return Ok(sortedRecords);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetRecords Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب السجلات الطبية." });
            }
        }

        [HttpPost]
        public IActionResult CreateRecord([FromBody] CreateMedicalRecordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(dto.PatientName) || string.IsNullOrWhiteSpace(dto.Diagnosis))
                return BadRequest(new { message = "الحقول الأساسية (اسم المريض والتشخيص) مطلوبة" });

            try
            {
                lock (_lock)
                {
                    var newRecord = new MedicalRecord
                    {
                        Id = Records.Count > 0 ? Records.Max(r => r.Id) + 1 : 1,
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
            catch (Exception ex)
            {
                Console.WriteLine($"[CreateRecord Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء السجل الطبي." });
            }
        }

        // [إضافة جديدة ضرورية]: دالة حذف السجل الطبي لتتوافق مع زر الحذف في الواجهة الأمامية
        [HttpDelete("{id}")]
        public IActionResult DeleteRecord(int id)
        {
            try
            {
                lock (_lock)
                {
                    var record = Records.FirstOrDefault(r => r.Id == id);
                    if (record == null)
                        return NotFound(new { message = "السجل الطبي غير موجود." });

                    Records.Remove(record);
                    return NoContent(); // 204 No Content يشير إلى نجاح الحذف
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DeleteRecord Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف السجل الطبي." });
            }
        }
    }
}