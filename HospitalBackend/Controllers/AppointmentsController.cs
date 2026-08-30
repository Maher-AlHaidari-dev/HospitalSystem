using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HospitalBackend.Data;
using HospitalBackend.Models;
using HospitalBackend.DTOs;

namespace HospitalBackend.Controllers
{
    [Authorize] // [حماية أمنية]: قفل الكنترولر بالكامل بحيث لا يمكن الوصول إليه إلا بمصادقة صحيحة
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            try
            {
                return await _context.Appointments
                    .AsNoTracking()
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetAppointments Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب المواعيد." });
            }
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments
                    .AsNoTracking()
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (appointment == null)
                {
                    return NotFound(new { message = "الموعد غير موجود" });
                }

                return appointment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetAppointment Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب بيانات الموعد." });
            }
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(CreateAppointmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var appointment = new Appointment
                {
                    PatientName = dto.PatientName,
                    DoctorName = dto.DoctorName,
                    Department = dto.Department,
                    AppointmentDate = dto.AppointmentDate,
                    Notes = dto.Notes,
                    Status = "مؤكد",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PostAppointment Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء الموعد." });
            }
        }

        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest(new { message = "معرف الموعد غير متطابق" });
            }

            var existingAppointment = await _context.Appointments.FindAsync(id);
            if (existingAppointment == null)
            {
                return NotFound(new { message = "الموعد غير موجود" });
            }

            existingAppointment.PatientName = appointment.PatientName;
            existingAppointment.DoctorName = appointment.DoctorName;
            existingAppointment.Department = appointment.Department;
            existingAppointment.AppointmentDate = appointment.AppointmentDate;
            existingAppointment.Status = appointment.Status;
            existingAppointment.Notes = appointment.Notes;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound(new { message = "الموعد غير موجود" });
                }
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PutAppointment Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء تحديث الموعد." });
            }

            return NoContent();
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null)
                {
                    return NotFound(new { message = "الموعد غير موجود" });
                }

                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DeleteAppointment Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء حذف الموعد." });
            }
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
    }
}