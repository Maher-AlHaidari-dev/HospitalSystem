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
    [Authorize] // [حماية أمنية]
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

                var totalPatients = await _context.Patients.CountAsync();

                var todaysAppointments = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate.Date == today);

                var totalScheduled = await _context.Appointments.CountAsync();

                var pendingInvoicesQuery = _context.Invoices
                    .Where(i => i.Status == "Pending" || i.Status == "Unpaid" || i.Status == "Partial");

                var pendingBillsCount = await pendingInvoicesQuery.CountAsync();
                
                // [تم الإصلاح]: حساب المبالغ المتبقية مباشرة في قاعدة البيانات باستخدام الحقل الأصلي TotalAmount (أداء صاروخي)
                var pendingAmount = await pendingInvoicesQuery
                    .SumAsync(i => (decimal?)(i.TotalAmount - i.PaidAmount)) ?? 0;
                
                var currentMonth = today.Month;
                var currentYear = today.Year;
                
                // [تم الإصلاح]: استخدام IssuedDate المربوط بقاعدة البيانات لتجنب خطأ (LINQ Translation) الذي كان يسبب انهيار السيرفر
                var totalRevenue = await _context.Invoices
                    .Where(i => i.IssuedDate.Month == currentMonth && i.IssuedDate.Year == currentYear)
                    .SumAsync(i => (decimal?)i.PaidAmount) ?? 0;

                var deptStats = await _context.Appointments
                    .AsNoTracking()
                    .Where(a => !string.IsNullOrEmpty(a.Department))
                    .GroupBy(a => a.Department)
                    .Select(g => new { Department = g.Key, Count = g.Count() })
                    .ToListAsync();

                var last7Days = Enumerable.Range(0, 7).Select(i => today.AddDays(-6 + i)).ToList();
                var startDate = today.AddDays(-6).Date;

                var patientsList = await _context.Patients
                    .AsNoTracking()
                    .Where(p => p.CreatedAt >= startDate)
                    .ToListAsync();

                var intakeLabels = last7Days.Select(d => d.ToString("ddd")).ToArray();
                var intakeCounts = last7Days.Select(d => patientsList.Count(p => p.CreatedAt.Date == d.Date)).ToArray();

                // المتغيرات هنا تطابق تماماً ملف dashboard.js (CamelCase)
                return Ok(new
                {
                    TotalPatients = totalPatients,
                    PatientGrowth = $"+{totalPatients} إجمالي المسجلين",
                    TodaysAppointments = todaysAppointments,
                    TotalScheduled = totalScheduled,
                    PendingBillsCount = pendingBillsCount,
                    PendingAmount = pendingAmount,
                    TotalRevenue = totalRevenue,
                    PatientIntakeData = new { Labels = intakeLabels, Counts = intakeCounts },
                    AppointmentsByDept = deptStats
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DashboardStats Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب إحصائيات لوحة التحكم." });
            }
        }
    }
}