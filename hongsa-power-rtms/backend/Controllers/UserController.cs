using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Models;
using Hongsa.Rtms.Api.DTOs;

namespace Hongsa.Rtms.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")] // เปิดบรรทัดนี้ถ้าต้องการให้เฉพาะ Admin ใช้ได้
public class UserController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public UserController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    // 1. GET: api/User (ดึงทั้งหมด)
    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                EmployeeId = user.EmployeeId,
                DepartmentName = user.DepartmentName,
                Role = roles.FirstOrDefault() ?? UserRolesModel.User,
                Status = "Active" // Mock ไว้ก่อน หรือดึงจาก user.IsActive ถ้ามี
            });
        }

        return Ok(userDtos);
    }

    // 2. GET: api/User/{id} (ดึงรายคน)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var roles = await _userManager.GetRolesAsync(user);
        
        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.UserName,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            EmployeeId = user.EmployeeId,
            DepartmentName = user.DepartmentName,
            Role = roles.FirstOrDefault() ?? UserRolesModel.User,
            Status = "Active"
        });
    }

    // 3. POST: api/User (สร้างใหม่)
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto model)
    {
        if (await _userManager.FindByEmailAsync(model.Email) != null)
            return BadRequest("Email already exists!");

        if (await _userManager.FindByNameAsync(model.Username) != null)
            return BadRequest("Username already exists!");

        var user = new ApplicationUser
        {
            UserName = model.Username,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmployeeId = model.EmployeeId,
            DepartmentName = model.DepartmentName,
            SecurityStamp = Guid.NewGuid().ToString()
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Assign Role
        if (!await _roleManager.RoleExistsAsync(model.Role))
        {
            await _roleManager.CreateAsync(new IdentityRole(model.Role));
        }
        await _userManager.AddToRoleAsync(user, model.Role);

        return Ok(new { Message = "User created successfully!" });
    }

    // 4. PUT: api/User/{id} (แก้ไข)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        // Update basic info
        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.EmployeeId = model.EmployeeId;
        user.DepartmentName = model.DepartmentName;
        
        // Update Role (ถ้าเปลี่ยน)
        var currentRoles = await _userManager.GetRolesAsync(user);
        var currentRole = currentRoles.FirstOrDefault();

        if (currentRole != model.Role)
        {
            // ลบ Role เก่า
            if (currentRole != null)
                await _userManager.RemoveFromRoleAsync(user, currentRole);
            
            // ใส่ Role ใหม่
            if (!await _roleManager.RoleExistsAsync(model.Role))
                await _roleManager.CreateAsync(new IdentityRole(model.Role));
            
            await _userManager.AddToRoleAsync(user, model.Role);
        }

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "User updated successfully!" });
    }

    // 5. DELETE: api/User/{id} (ลบ)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "User deleted successfully!" });
    }
}
