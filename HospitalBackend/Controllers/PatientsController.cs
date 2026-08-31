using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using HospitalBackend.Data;
using HospitalBackend.Models;

namespace HospitalBackend.Controllers
{
    [Authorize] // [حماية أمنية]: قفل ملفات المرضى وحمايتها من الوصول غير المصرح به (بيانات سرية وحساسة)
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PatientsController> _logger;

        public PatientsController(ApplicationDbContext context, ILogger<PatientsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            try
            {
                return await _context.Patients
                    .AsNoTracking()
                    .OrderByDescending(p => p.Id)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "حدث خطأ أثناء جلب قائمة المرضى.");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب قائمة المرضى." });
            }
        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Patient>> GetPatient(int id)
        {
            try
            {
                var patient = await _context.Patients
                    .AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (patient == null)
                {
                    return NotFound(new { message = "المريض غير موجود / Patient not found" });
                }

                return patient;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "حدث خطأ أثناء جلب بيانات المريض برقم المعرف: {PatientId}", id);
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب بيانات المريض." });
            }
        }

        // GET: api/Patients/search?query=ahmed
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Patient>>> SearchPatients([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                {
                    return await GetPatients();
                }

                var cleanQuery = query.Trim().ToLower();

                var patients = await _context.Patients
                    .AsNoTracking()
                    .Where(p => p.Name.ToLower().Contains(cleanQuery) ||
                                (p.PhoneNumber != null && p.PhoneNumber.Contains(cleanQuery)) ||
                                (p.Email != null && p.Email.ToLower().Contains(cleanQuery)))
                    .OrderByDescending(p => p.Id)
                    .ToListAsync();

                return Ok(patients);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "حدث خطأ أثناء البحث عن المرضى باستخدام الاستعلام: {Query}", query);
                return StatusCode(500, new { message = "حدث خطأ أثناء البحث عن المرضى." });
            }
        }

        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(Patient patient)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // حساب العمر تلقائياً بناءً على تاريخ الميلاد إذا تم توفيره
                if (patient.DateOfBirth.HasValue)
                {
                    patient.Age = CalculateAge(patient.DateOfBirth.Value);
                }

                patient.CreatedAt = DateTime.UtcNow;

                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "حدث خطأ أثناء إضافة مريض جديد.");
                return StatusCode(500, new { message = "حدث خطأ أثناء إضافة المريض." });
            }
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, Patient patient)
        {
            if (id != patient.Id)
            {
                return BadRequest(new { message = "معرف المريض غير متطابق / Patient ID mismatch" });
            }

            var existingPatient = await _context.Patients.FindAsync(id);
            if (existingPatient == null)
            {
                return NotFound(new { message = "المريض غير موجود / Patient not found" });
            }

            // تحديث الحقول فقط مع الحفاظ على CreatedAt الأصلي
            existingPatient.Name = patient.Name;
            existingPatient.DateOfBirth = patient.DateOfBirth;
            existingPatient.Gender = patient.Gender;
            existingPatient.PhoneNumber = patient.PhoneNumber;
            existingPatient.Email = patient.Email;
            existingPatient.Status = patient.Status;
            existingPatient.Address = patient.Address;
            existingPatient.MedicalHistory = patient.MedicalHistory;

            if (patient.DateOfBirth.HasValue)
            {
                existingPatient.Age = CalculateAge(patient.DateOfBirth.Value);
            }
            else
            {
                existingPatient.Age = patient.Age;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!PatientExists(id))
                {
                    return NotFound(new { message = "المريض غير موجود / Patient not found" });
                }
                else
                {
                    _logger.LogError(ex, "حدث خطأ تزامن (Concurrency) أثناء تحديث المريض رقم: {PatientId}", id);
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "حدث خطأ أثناء تحديث بيانات المريض رقم: {PatientId}", id);
                return StatusCode(500, new { message = "حدث خطأ أثناء تحديث بيانات المريض." });
            }

            return NoContent();
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                var patient = await _context.Patients.FindAsync(id);
                if (patient == null)
                {
                    return NotFound(new { message = "المريض غير موجود / Patient not found" });
                }

                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "حدث خطأ أثناء حذف المريض رقم: {PatientId}", id);
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف المريض." });
            }
        }

        // دالة مساعدة لحساب العمر بدقة
        private static int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.UtcNow.Date;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > today.AddYears(-age)) age--;
            return age < 0 ? 0 : age;
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}