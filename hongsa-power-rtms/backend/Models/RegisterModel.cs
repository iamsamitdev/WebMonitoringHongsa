using System.ComponentModel.DataAnnotations;

namespace Hongsa.Rtms.Api.Models;

public class RegisterModel
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, ErrorMessage = "Username is too long")]
    [MinLength(3, ErrorMessage = "Username is too short")]
    public required string Username { get; set; }
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is not valid")]
    public required string Email { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }

    // เพิ่มฟิลด์ใหม่ให้หน้ารับค่า
    [Required(ErrorMessage = "First Name is required")]
    public required string FirstName { get; set; }

    [Required(ErrorMessage = "Last Name is required")]
    public required string LastName { get; set; }

    [Required(ErrorMessage = "Employee ID is required")]
    public required string EmployeeId { get; set; }
    
    [Required(ErrorMessage = "Department Name is required")]
    public required string DepartmentName { get; set; }
}