using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalBackend.Data;
using HospitalBackend.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HospitalBackend.Controllers
{
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

                // 1. إجمالي المرضى
                var totalPatients = await _context.Patients.CountAsync();

                // 2. مواعيد اليوم
                var todaysAppointments = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate.Date == today);

                // 3. إجمالي المواعيد
                var totalScheduled = await _context.Appointments.CountAsync();

                // 4. حساب الفواتير والإيرادات الحقيقية من جدول Invoices
                var invoices = await _context.Invoices.ToListAsync();
                
                // احتساب الفواتير المعلقة أو غير المدفوعة أو المدفوعة جزئياً
                var pendingBillsCount = invoices.Count(i => i.Status == "Pending" || i.Status == "Unpaid" || i.Status == "Partial");
                
                // حساب المبلغ المتبقي بدقة (إجمالي المبلغ - المبلغ المدفوع فعلياً)
                var pendingAmount = invoices
                    .Where(i => i.Status == "Pending" || i.Status == "Unpaid" || i.Status == "Partial")
                    .Sum(i => i.Amount - i.PaidAmount);
                
                // الإيرادات المحصلة (مجموع المبالغ المدفوعة الفعلية PaidAmount لهذا الشهر)
                var currentMonth = today.Month;
                var currentYear = today.Year;
                var totalRevenue = invoices
                    .Where(i => i.Date.Month == currentMonth && i.Date.Year == currentYear)
                    .Sum(i => i.PaidAmount);

                // 5. توزيع المواعيد حسب القسم
                var deptStats = await _context.Appointments
                    .Where(a => !string.IsNullOrEmpty(a.Department))
                    .GroupBy(a => a.Department)
                    .Select(g => new
                    {
                        Department = g.Key,
                        Count = g.Count()
                    })
                    .ToListAsync();

                // 6. حساب المرضى خلال آخر 7 أيام
                var last7Days = Enumerable.Range(0, 7)
                    .Select(i => today.AddDays(-6 + i))
                    .ToList();

                var startDate = today.AddDays(-6).Date;

                var patientsList = await _context.Patients
                    .Where(p => p.CreatedAt >= startDate)
                    .ToListAsync();

                var intakeLabels = last7Days.Select(d => d.ToString("ddd")).ToArray();
                var intakeCounts = last7Days
                    .Select(d => patientsList.Count(p => p.CreatedAt.Date == d.Date))
                    .ToArray();

                return Ok(new
                {
                    TotalPatients = totalPatients,
                    PatientGrowth = $"+{totalPatients} إجمالي المسجلين",
                    TodaysAppointments = todaysAppointments,
                    TotalScheduled = totalScheduled,
                    PendingBillsCount = pendingBillsCount,
                    PendingAmount = pendingAmount,
                    TotalRevenue = totalRevenue,
                    PatientIntakeData = new
                    {
                        Labels = intakeLabels,
                        Counts = intakeCounts
                    },
                    AppointmentsByDept = deptStats
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}