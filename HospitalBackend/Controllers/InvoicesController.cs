using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HospitalBackend.Data;
using HospitalBackend.Models;
using System.Threading.Tasks;
using System;

namespace HospitalBackend.Controllers
{
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
            var invoices = await _context.Invoices.ToListAsync();
            return Ok(invoices);
        }

        // 2. إنشاء فاتورة جديدة
        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // تصفير المعرف لضمان توليده تلقائياً بواسطة قاعدة البيانات (Auto-increment)
            invoice.Id = 0;

            if (string.IsNullOrEmpty(invoice.InvoiceNumber))
            {
                invoice.InvoiceNumber = $"INV-2026-{new Random().Next(1000, 9999)}";
            }

            // استخدام الحقل القديم Date المتوافق مع الداشبورد
            if (invoice.Date == default)
            {
                invoice.Date = DateTime.Now;
            }

            if (string.IsNullOrEmpty(invoice.Status))
            {
                invoice.Status = "Pending";
            }

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(invoice);
        }

        // 3. تسجيل دفع (Record Payment)
        [HttpPost("{id}/pay")]
        public async Task<IActionResult> RecordPayment(int id, [FromBody] decimal amount)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            invoice.PaidAmount += amount;
            
            // الاعتماد على الحقل القديم Amount المتوافق مع الداشبورد للمقارنة
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
    }
}