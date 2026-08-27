using System;
using System.ComponentModel.DataAnnotations;

namespace HospitalBackend.DTOs
{
    public class CreatePatientDto
    {
        [Required(ErrorMessage = "الاسم الكامل مطلوب / Full name is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "الاسم يجب أن يكون بين 3 و 100 حرف / Name must be between 3 and 100 characters")]
        public string Name { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime? DateOfBirth { get; set; }

        [Range(0, 120, ErrorMessage = "العمر يجب أن يكون بين 0 و 120 / Age must be between 0 and 120")]
        public int Age { get; set; }

        [Required(ErrorMessage = "الجنس مطلوب / Gender is required")]
        [RegularExpression(@"^(ذكر|أنثى|Male|Female)$", ErrorMessage = "الجنس يجب أن يكون (ذكر/أنثى) أو (Male/Female)")]
        public string Gender { get; set; } = string.Empty;

        [Required(ErrorMessage = "رقم الهاتف مطلوب / Phone number is required")]
        [Phone(ErrorMessage = "صيغة الهاتف غير صحيحة / Invalid phone number format")]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [EmailAddress(ErrorMessage = "صيغة البريد الإلكتروني غير صحيحة / Invalid email format")]
        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active";

        [StringLength(200)]
        public string? Address { get; set; }

        [StringLength(1000)]
        public string? MedicalHistory { get; set; }
    }
}