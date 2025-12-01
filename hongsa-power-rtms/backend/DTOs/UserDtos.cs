using System.ComponentModel.DataAnnotations;

namespace Hongsa.Rtms.Api.DTOs;

// สำหรับแสดงผลในตาราง
public class UserDto
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmployeeId { get; set; }
    public string DepartmentName { get; set; }
    public string Role { get; set; } // "Admin" or "User"
    public string Status { get; set; } // "Active"
}

// สำหรับสร้าง User ใหม่
public class CreateUserDto
{
    [Required]
    public string Username { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmployeeId { get; set; }
    public string DepartmentName { get; set; }
    public string Role { get; set; } = "User"; // Default
}

// สำหรับแก้ไขข้อมูล
public class UpdateUserDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmployeeId { get; set; }
    public string DepartmentName { get; set; }
    public string Role { get; set; }
    // public string Status { get; set; } // ถ้ามีฟิลด์ Status ใน ApplicationUser
}
