using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HospitalBackend.Data;
using HospitalBackend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var today = DateTime.Today;
                var todayStart = today;
                var todayEnd = today.AddDays(1);

                // 1. إجمالي المرضى
                var totalPatients = await _context.Patients.CountAsync();

                // 2. جلب المواعيد والفواتير لمعالجتها بأمان تام
                var allAppointments = await _context.Appointments.AsNoTracking().ToListAsync();
                var allInvoices = await _context.Invoices.AsNoTracking().ToListAsync();

                // حساب مواعيد اليوم بطريقة آمنة
                var todaysAppointments = allAppointments
                    .Count(a => a.AppointmentDate >= todayStart && a.AppointmentDate < todayEnd);

                var totalScheduled = allAppointments.Count;

                // 3. الفواتير المعلقة والمتبقي (تحديدها بناءً على الحالة أو إذا كان المبلغ المتبقي أكبر من صفر)
                var pendingInvoices = allInvoices.Where(i => 
                    (i.Status != null && (
                        i.Status.Contains("pend", StringComparison.OrdinalIgnoreCase) || 
                        i.Status.Contains("معلق", StringComparison.OrdinalIgnoreCase) || 
                        i.Status.Contains("unpaid", StringComparison.OrdinalIgnoreCase) ||
                        i.Status.Contains("partial", StringComparison.OrdinalIgnoreCase)
                    )) || 
                    (i.TotalAmount > i.PaidAmount)
                ).ToList();

                var pendingBillsCount = pendingInvoices.Count;
                var pendingAmount = pendingInvoices.Sum(i => i.TotalAmount - i.PaidAmount);
                
                // 4. إيرادات الشهر الحالي
                var currentMonth = today.Month;
                var currentYear = today.Year;
                
                var totalRevenue = allInvoices
                    .Where(i => i.IssuedDate.Month == currentMonth && i.IssuedDate.Year == currentYear)
                    .Sum(i => i.PaidAmount);

                // 5. احصائيات الأقسام للمواعيد
                var deptStats = allAppointments
                    .Where(a => !string.IsNullOrEmpty(a.Department))
                    .GroupBy(a => a.Department)
                    .Select(g => new { department = g.Key, count = g.Count() })
                    .ToList();

                // 6. تسجيل المرضى خلال آخر 7 أيام
                var last7Days = Enumerable.Range(0, 7).Select(i => today.AddDays(-6 + i)).ToList();
                var startDate = today.AddDays(-6);

                var patientsList = await _context.Patients
                    .AsNoTracking()
                    .Where(p => p.CreatedAt >= startDate)
                    .ToListAsync();

                var intakeLabels = last7Days.Select(d => d.ToString("ddd")).ToArray();
                var intakeCounts = last7Days.Select(d => patientsList.Count(p => p.CreatedAt.Date == d.Date)).ToArray();

                return Ok(new
                {
                    totalPatients = totalPatients,
                    patientGrowth = $"+{totalPatients} إجمالي المسجلين",
                    todaysAppointments = todaysAppointments,
                    totalScheduled = totalScheduled,
                    pendingBillsCount = pendingBillsCount,
                    pendingAmount = pendingAmount,
                    totalRevenue = totalRevenue,
                    patientIntakeData = new { labels = intakeLabels, counts = intakeCounts },
                    appointmentsByDept = deptStats
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DashboardStats Error] {ex.Message}");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب إحصائيات لوحة التحكم.", details = ex.Message });
            }
        }
    }
}