using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using HospitalBackend.Data;
using HospitalBackend.Models;

namespace HospitalBackend.Controllers
{
    [Authorize] // حماية كاملة: يمنع الوصول بدون JWT Token صالح
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/settings/profile
        // جلب بيانات الملف الشخصي والتفضيلات للمستخدم المسجل حالياً
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "المستخدم غير مصرح له" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "لم يتم العثور على حساب المستخدم" });

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.AppointmentReminders
            });
        }

        // 2. PUT: api/settings/profile
        // تحديث بيانات الملف الشخصي والتفضيلات
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { message = "المستخدم غير مصرح له" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound(new { message = "لم يتم العثور على حساب المستخدم" });

            // التحقق مما إذا كان البريد الجديد مستخدماً من قبل شخص آخر
            if (user.Email != dto.Email)
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != userId);
                if (emailExists)
                    return BadRequest(new { message = "البريد الإلكتروني مستخدم بالفعل من قبل حساب آخر" });

                user.Email = dto.Email;
            }

            user.FullName = dto.FullName;
            user.AppointmentReminders = dto.AppointmentReminders;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "تم تحديث الإعدادات بنجاح",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.Role,
                    user.AppointmentReminders
                }
            });
        }

        // دالة مساعدة لاستخراج معرف المستخدم من الـ JWT Claims
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? User.FindFirst("sub")?.Value;

            if (int.TryParse(userIdClaim, out int id))
                return id;

            return null;
        }
    }

    // DTO الخاص باستقبال طلب التحديث
    public class UpdateProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool AppointmentReminders { get; set; }
    }
}