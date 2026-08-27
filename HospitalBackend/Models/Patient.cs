using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalBackend.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "الاسم الكامل مطلوب / Full name is required")]
        [StringLength(100, ErrorMessage = "الاسم يجب ألا يتجاوز 100 حرف / Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        public int Age { get; set; }

        [Required(ErrorMessage = "الجنس مطلوب / Gender is required")]
        [StringLength(10)]
        public string Gender { get; set; } = string.Empty;

        [Required(ErrorMessage = "رقم الهاتف مطلوب / Phone number is required")]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [StringLength(100)]
        [EmailAddress(ErrorMessage = "صيغة البريد الإلكتروني غير صحيحة / Invalid email address")]
        public string? Email { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active"; // تم توحيد القيمة الافتراضية للغة الإنجليزية لتسهيل الترجمة في الواجهة الأمامية

        [StringLength(200)]
        public string? Address { get; set; }

        public string? MedicalHistory { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}