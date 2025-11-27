using Microsoft.AspNetCore.Identity;

namespace Hongsa.Rtms.Api.Models
{
    // สืบทอดคุณสมบัติเดิมจาก IdentityUser (เช่น Id, Username, Email, PasswordHash)
    public class ApplicationUser : IdentityUser
    {
        // เพิ่ม Column ที่ต้องการ
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
    }
}