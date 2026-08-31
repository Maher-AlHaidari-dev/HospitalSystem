using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using HospitalBackend.Data;
using HospitalBackend.Models;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace HospitalBackend.Controllers
{
    [Authorize] // [حماية أمنية]
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<InvoicesController> _logger;

        public InvoicesController(ApplicationDbContext context, ILogger<InvoicesController> logger)
        {
            _context = context;
            _logger = logger;
        }

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
                _logger.LogError(ex, "حدث خطأ أثناء جلب قائمة الفواتير.");
                return StatusCode(500, new { message = "حدث خطأ أثناء جلب الفواتير." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                invoice.Id = 0;

                if (string.IsNullOrEmpty(invoice.InvoiceNumber))
                {
                    invoice.InvoiceNumber = $"INV-2026-{new Random().Next(1000, 9999)}";
                }

                if (invoice.IssuedDate == default)
                {
                    invoice.IssuedDate = DateTime.UtcNow;
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
                _logger.LogError(ex, "حدث خطأ أثناء إنشاء الفاتورة.");
                return StatusCode(500, new { message = "حدث خطأ أثناء إنشاء الفاتورة." });
            }
        }

        [HttpPost("{id}/pay")]
        public async Task<IActionResult> RecordPayment(int id, [FromBody] decimal amount)
        {
            if (amount <= 0)
                return BadRequest(new { message = "يجب أن يكون مبلغ الدفع أكبر من الصفر" });

            try
            {
                var invoice = await _context.Invoices.FindAsync(id);
                if (invoice == null) return NotFound(new { message = "الفاتورة غير موجودة" });

                invoice.PaidAmount += amount;
                
                if (invoice.PaidAmount >= invoice.TotalAmount)
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
                _logger.LogError(ex, "حدث خطأ أثناء تسجيل عملية الدفع للفاتورة رقم: {InvoiceId}", id);
                return StatusCode(500, new { message = "حدث خطأ أثناء تسجيل عملية الدفع." });
            }
        }
    }
}