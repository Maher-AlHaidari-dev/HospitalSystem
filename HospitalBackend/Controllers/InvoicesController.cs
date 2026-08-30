using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using HospitalBackend.Data;
using HospitalBackend.Models;
using System.Threading.Tasks;
using System;

namespace HospitalBackend.Controllers
{
    [Authorize] // [حماية أمنية]: قفل الكنترولر المالي ومنع الوصول غير المصرح به للفواتير والمدفوعات
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. جلب كل الفواتير
        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            try
            {
                var invoices = await _context.Invoices
                    .AsNoTracking()
                    .OrderByDescending(i => i.Id)
                    .ToListAsync();
                
                return Ok(invoices);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetInvoices Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب الفواتير." });
            }
        }

        // 2. إنشاء فاتورة جديدة
        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            try
            {
                // تصفير المعرف لضمان توليده تلقائياً بواسطة قاعدة البيانات (Auto-increment)
                invoice.Id = 0;

                if (string.IsNullOrEmpty(invoice.InvoiceNumber))
                {
                    invoice.InvoiceNumber = $"INV-2026-{new Random().Next(1000, 9999)}";
                }

                // استخدام التوقيت العالمي الموحد UTC للموثوقية مع الداشبورد
                if (invoice.Date == default)
                {
                    invoice.Date = DateTime.UtcNow;
                }

                if (string.IsNullOrEmpty(invoice.Status))
                {
                    invoice.Status = "Pending";
                }

                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();

                return Ok(invoice);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CreateInvoice Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء الفاتورة." });
            }
        }

        // 3. تسجيل دفع (Record Payment)
        [HttpPost("{id}/pay")]
        public async Task<IActionResult> RecordPayment(int id, [FromBody] decimal amount)
        {
            // [حماية أمنية]: منع إدخال مبالغ سالبة أو صفرية للتلاعب بالحسابات المالية
            if (amount <= 0)
            {
                return BadRequest(new { message = "يجب أن يكون مبلغ الدفع أكبر من الصفر" });
            }

            try
            {
                var invoice = await _context.Invoices.FindAsync(id);
                if (invoice == null) 
                    return NotFound(new { message = "الفاتورة غير موجودة" });

                invoice.PaidAmount += amount;
                
                // الاعتماد على الحقل Amount للمقارنة وتحديث الحالة بدقة
                if (invoice.PaidAmount >= invoice.Amount)
                {
                    invoice.Status = "Paid";
                }
                else if (invoice.PaidAmount > 0)
                {
                    invoice.Status = "Partial";
                }

                await _context.SaveChangesAsync();
                return Ok(invoice);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[RecordPayment Error] {ex}");
                return StatusCode(500, new { message = "حدث خطأ أثناء تسجيل عملية الدفع." });
            }
        }
    }
}