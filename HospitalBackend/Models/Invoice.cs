using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HospitalBackend.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        public string InvoiceNumber { get; set; }

        public string PatientName { get; set; }

        // الخصائص الأصلية والبديلة لضمان توافق الداشبورد والكنترولر معاً بدون أخطاء
        [Column("TotalAmount")]
        public decimal TotalAmount { get; set; }

        [NotMapped]
        public decimal Amount
        {
            get => TotalAmount;
            set => TotalAmount = value;
        }

        public decimal PaidAmount { get; set; }

        [Column("IssuedDate")]
        public DateTime IssuedDate { get; set; }

        [NotMapped]
        public DateTime Date
        {
            get => IssuedDate;
            set => IssuedDate = value;
        }

        public DateTime DueDate { get; set; }

        public string Status { get; set; } // Paid, Partial, Pending, Unpaid
    }
}