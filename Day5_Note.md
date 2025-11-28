## Website Monitoring Real-time Machine Status - Day 5

1. [React Backend Layout and Component Structure](#react-backend-layout-and-component-structure)
2. [Test Forecast & Review Flow](#test-forecast-review-flow)
3. [Test Real-Time & Notification Flow](#test-real-time-notification-flow)
4. [Test Email Notification Flow](#test-email-notification-flow)
5. [Setup Web Server for Deployment](#setup-web-server-for-deployment)
6. [Prepare Backend API Project for deployment](#prepare-backend-api-project-for-deployment)
7. [Build Frontend Project for deployment](#build-frontend-project-for-deployment)
8. [Build Backend Project for deployment](#build-backend-project-for-deployment)
9. [Deployed Backend API on IIS Server](#deployed-backend-api-on-iis-server)
10. [Deployed Frontend to Server](#deployed-frontend-to-server)

### Update backend API
#### Step 1: แก้ไข AuthenticateController.cs เพื่อส่ง Role กลับไปยัง Frontend
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticateController: ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    // Constructor
    public AuthenticateController(
        UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, 
        IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    // Register for User
    // Post api/authenticate/register-user
    [HttpPost]
    [Route("register-user")]
    public async Task<ActionResult> RegisterUser([FromBody] RegisterModel model)
    {
        // เช็คว่า username ซ้ำหรือไม่
        var userExists = await _userManager.FindByNameAsync(model.Username);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User already exists!"
                }
            );
        }

        // เช็คว่า email ซ้ำหรือไม่
        userExists = await _userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "Email already exists!"
                }
            );
        }

        // สร้าง User
        // ให้ใช้ ApplicationUser แทน IdentityUser
        ApplicationUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username,
            // Map ข้อมูลใหม่ลงไป
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmployeeId = model.EmployeeId,
            DepartmentName = model.DepartmentName
        };

        // สร้าง User ในระบบ
        var result = await _userManager.CreateAsync(user, model.Password);

        // ถ้าสร้างไม่สำเร็จ
        if(!result.Succeeded)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User creation failed! Please check user details and try again."
                }
            );
        }

        // กำหนด Roles Admin, User
        if (!await _roleManager.RoleExistsAsync(UserRolesModel.Admin))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.Admin));
        }

        if (!await _roleManager.RoleExistsAsync(UserRolesModel.User))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.User));
        }

        if (await _roleManager.RoleExistsAsync(UserRolesModel.User))
        {
            await _userManager.AddToRoleAsync(user, UserRolesModel.User);
        }

        return Ok(new ResponseModel
        {
            Status = "Success",
            Message = "User registered successfully"
        });
    }
    
    // Register for Admin
    // Post api/authenticate/register-admin
    [HttpPost]
    [Route("register-admin")]
    public async Task<ActionResult> RegisterAdmin([FromBody] RegisterModel model)
    {
        // เช็คว่า username ซ้ำหรือไม่
        var userExists = await _userManager.FindByNameAsync(model.Username);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User already exists!"
                }
            );
        }

        // เช็คว่า email ซ้ำหรือไม่
        userExists = await _userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "Email already exists!"
                }
            );
        }

        // สร้าง User
        // ให้ใช้ ApplicationUser แทน IdentityUser
        ApplicationUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username,
            // Map ข้อมูลใหม่ลงไป
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmployeeId = model.EmployeeId,
            DepartmentName = model.DepartmentName
        };

        // สร้าง User ในระบบ
        var result = await _userManager.CreateAsync(user, model.Password);

        // ถ้าสร้างไม่สำเร็จ
        if(!result.Succeeded)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User creation failed! Please check user details and try again."
                }
            );
        }

        // กำหนด Roles Admin, User
        if (await _roleManager.RoleExistsAsync(UserRolesModel.Admin)){
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.Admin));
            await _userManager.AddToRoleAsync(user, UserRolesModel.Admin);
        }

        if (!await _roleManager.RoleExistsAsync(UserRolesModel.User)){
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.User));
        }

        return Ok(new ResponseModel
        {
            Status = "Success",
            Message = "User registered successfully"
        });
    }

    // Login for User
    // Post api/authenticate/login-user
    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginModel model)
    {

        var user = await _userManager.FindByNameAsync(model.Username!);

        // ถ้า login สำเร็จ
        if(user != null && await _userManager.CheckPasswordAsync(user, model.Password!))
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id), // Add User ID to Claims
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GetToken(authClaims);

            return Ok(new 
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                roles = userRoles,
                firstName = user.FirstName,
                lastName = user.LastName
            });
        }

        // ถ้า login ไม่สำเร็จ
        return Unauthorized();
    }

    // ฟังก์ชันสร้าง Token
    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));

        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // Windows time zone ID

        // Get the current time in Bangkok time zone
        var currentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, timeZoneInfo);

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: currentTime.AddDays(1), // อายุของ Token 1 วัน
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }
}
```

#### Step 2: แก้ไข ForcastController.cs เพื่อเพิ่ม API ดึงข้อมูล Forecast ทั้งหมด
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Hongsa.Rtms.Api.Data;
using Hongsa.Rtms.Api.Models;
using Hongsa.Rtms.Api.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace Hongsa.Rtms.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ForecastController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ForecastController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // 1. GET Config (Master Data)
    [HttpGet("config")]
    public async Task<IActionResult> GetConfig()
    {
        var statusList = await _context.MachineStatusConfigs.ToListAsync();
        // สร้าง TimeSlots แบบ Static 00:00 - 23:00 (ถ้าต้องการ)
        return Ok(new { MachineStatus = statusList });
    }

    // 2. POST Submit Plan (User)
    [HttpPost("submit")]
    public async Task<IActionResult> SubmitPlan([FromBody] SubmitPlanDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // ดึง ID คน login
        
        if (string.IsNullOrEmpty(userId))
        {
             return Unauthorized("User ID not found in token.");
        }

        // เช็คว่าเคยมี Plan วันนี้ไหม เพื่อทำ Revision
        var existingRequest = await _context.ForecastRequests
            .Where(r => r.TargetDate.Date == dto.TargetDate.Date)
            .OrderByDescending(r => r.RevisionNo)
            .FirstOrDefaultAsync();

        int nextRev = (existingRequest == null) ? 0 : existingRequest.RevisionNo + 1;

        var request = new ForecastRequest
        {
            TargetDate = dto.TargetDate,
            RevisionNo = nextRev,
            RequestStatus = "Pending",
            SubmittedBy = userId,
            SubmittedDate = DateTime.Now
        };

        // Map Items
        foreach (var item in dto.Items)
        {
            request.Items.Add(new ForecastRequestItem
            {
                StartTime = TimeSpan.Parse(item.StartTime),
                EndTime = TimeSpan.Parse(item.EndTime),
                StatusID = item.StatusID
            });
        }

        _context.ForecastRequests.Add(request);
        await _context.SaveChangesAsync();

        // Notify Admins
        // (Notification logic can be added here)

        return Ok(new { Message = "Plan submitted successfully", Revision = nextRev });
    }

    // 3. GET Pending (Admin)
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var list = await _context.ForecastRequests
            .Include(r => r.Submitter) // Include User Info
            .Where(r => r.RequestStatus == "Pending")
            .OrderByDescending(r => r.SubmittedDate)
            .ToListAsync();
        return Ok(list);
    }

    // 4. GET Preview Logic (Admin)
    [HttpGet("{requestId}/preview")]
    public async Task<IActionResult> GetPreview(int requestId)
    {
        var request = await _context.ForecastRequests
            .Include(r => r.Items)
            .ThenInclude(i => i.StatusConfig)
            .FirstOrDefaultAsync(r => r.RequestID == requestId);

        if (request == null) return NotFound();

        // Logic: ดึง Max Load ของเมื่อวาน (TargetDate - 1)
        var yesterday = request.TargetDate.AddDays(-1);
        var stats = await _context.DailyMaxLoadStats
            .FirstOrDefaultAsync(s => s.StatDate == yesterday);
        
        decimal maxLoadRef = stats?.MaxLoadMW ?? 0; // ถ้าไม่มีสถิติ ให้เป็น 0 (หรือค่า default อื่น)

        var previewList = new List<PreviewResultDto>();

        foreach (var item in request.Items)
        {
            decimal calcMW = 0;
            string logic = "";

            // ถ้า Config มีค่า Default (เช่น Not Run = 0.5) ให้ใช้ค่า Config
            if (item.StatusConfig != null && item.StatusConfig.DefaultLoadMW.HasValue)
            {
                calcMW = item.StatusConfig.DefaultLoadMW.Value;
                logic = "Default Config";
            }
            else
            {
                // ถ้าเป็น Run Continuous ให้ใช้ MaxLoad ของเมื่อวาน
                calcMW = maxLoadRef;
                logic = $"Max Load of {yesterday:dd/MM}";
            }

            previewList.Add(new PreviewResultDto
            {
                StartTime = item.StartTime.ToString(@"hh\:mm"),
                EndTime = item.EndTime.ToString(@"hh\:mm"),
                StatusID = item.StatusID,
                StatusName = item.StatusConfig?.StatusName ?? "-",
                CalculatedMW = calcMW,
                SourceLogic = logic
            });
        }

        return Ok(previewList);
    }

    // 5. POST Approve (Admin)
    [HttpPost("approve")]
    public async Task<IActionResult> ApprovePlan([FromBody] ApprovePlanDto dto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (adminId == null) return Unauthorized("No user found in database.");

        var request = await _context.ForecastRequests.FindAsync(dto.RequestID);
        if (request == null) return NotFound();

        // Update Header
        request.RequestStatus = "Approved";
        request.ReviewedBy = adminId;
        request.ReviewedDate = DateTime.Now;

        // Save to ApprovedForecasts (Final Table)
        // ลบของเก่าของวันนั้นทิ้งก่อน (ถ้ามี) เพื่อกันซ้ำซ้อน
        var oldApproved = _context.ApprovedForecasts.Where(a => a.TargetDate == request.TargetDate);
        _context.ApprovedForecasts.RemoveRange(oldApproved);

        // วนลูปจากสิ่งที่ Admin ส่งมา (Final Value)
        foreach (var item in dto.Items)
        {
            // *หมายเหตุ: ในความจริงควร join กับ request.Items เพื่อเอา StatusID มาด้วย
            // แต่นี่เขียนแบบย่อ
            var originalItem = await _context.ForecastRequestItems
                    .FirstOrDefaultAsync(x => x.RequestID == dto.RequestID && 
                                        x.StartTime == TimeSpan.Parse(item.StartTime));

            _context.ApprovedForecasts.Add(new ApprovedForecast
            {
                TargetDate = request.TargetDate,
                StartTime = TimeSpan.Parse(item.StartTime),
                EndTime = TimeSpan.Parse(item.EndTime),
                StatusID = originalItem?.StatusID ?? 0,
                CalculatedLoadMW = 0, // ควรเก็บค่า Original Calculated ไว้ด้วยถ้าทำได้
                FinalLoadMW = item.FinalLoadMW,
                IsAdminEdited = true, // Admin เป็นคนกด Approve ถือว่าผ่านตา Admin แล้ว
                SourceRequestID = request.RequestID
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Plan Approved" });
    }

    // 6. POST Return (Admin)
    [HttpPost("return")]
    public async Task<IActionResult> ReturnPlan([FromBody] ReturnPlanDto dto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        // if (adminId == null) return Unauthorized("No user found in database.");

        // กรณี Dev/Test: ถ้าไม่ได้ Login ให้ใช้ User คนแรกใน DB แทน
        if (adminId == null)
        {
            var firstUser = await _context.Users.FirstOrDefaultAsync();
            if (firstUser != null) adminId = firstUser.Id;
            else return Unauthorized("No user found in database.");
        }

        var request = await _context.ForecastRequests
            .Include(r => r.Submitter)
            .FirstOrDefaultAsync(r => r.RequestID == dto.RequestID);

        if (request == null) return NotFound();

        request.RequestStatus = "Returned";
        request.AdminComment = dto.Comment;
        request.ReviewedBy = adminId;
        request.ReviewedDate = DateTime.Now;

        await _context.SaveChangesAsync();

        // Trigger Email Service to notify User

        return Ok(new { Message = "Plan Returned" });
    }

    // 7. GET My History (User)
    [HttpGet("history")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var list = await _context.ForecastRequests
            .Include(r => r.Items)
            .ThenInclude(i => i.StatusConfig)
            .Where(r => r.SubmittedBy == userId)
            .OrderByDescending(r => r.TargetDate)
            .ThenByDescending(r => r.RevisionNo)
            .ToListAsync();

        return Ok(list);
    }

    // 8. GET All History (Admin)
    [HttpGet("all-history")]
    public async Task<IActionResult> GetAllHistory()
    {
        var list = await _context.ForecastRequests
            .Include(r => r.Submitter)
            .Include(r => r.Items)
            .ThenInclude(i => i.StatusConfig)
            .OrderByDescending(r => r.TargetDate)
            .ThenByDescending(r => r.SubmittedDate)
            .ToListAsync();

        return Ok(list);
    }
}
```

#### Step 3: เพิ่ม Contoller `MonitoringController.cs` สำหรับดึงข้อมูล Real-time
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;

namespace Hongsa.Rtms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonitorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MonitorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET Dashboard Stats (Cards)
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetStats()
        {
            var now = DateTime.Now;
            var timeNow = now.TimeOfDay;

            // 1. Get Latest Actual Load
            var actual = await _context.ActualMachineLoads
                .OrderByDescending(x => x.LogDateTime)
                .FirstOrDefaultAsync();

            decimal actualVal = actual?.ActualLoadMW ?? 0;

            // 2. Get Forecast Load for current time
            var forecast = await _context.ApprovedForecasts
                .Where(x => x.TargetDate == now.Date && 
                            x.StartTime <= timeNow && 
                            x.EndTime > timeNow)
                .FirstOrDefaultAsync();

            decimal forecastVal = forecast?.FinalLoadMW ?? 0;

            // 3. Calculate % Diff
            decimal diffPercent = 0;
            if (forecastVal != 0)
            {
                diffPercent = Math.Abs((actualVal - forecastVal) / forecastVal) * 100;
            }

            return Ok(new 
            { 
                ActualMW = actualVal, 
                ForecastMW = forecastVal, 
                DiffPercent = Math.Round(diffPercent, 2),
                LastUpdate = actual?.LogDateTime
            });
        }

        // 2. GET Chart Data
        [HttpGet("chart-data")]
        public async Task<IActionResult> GetChartData([FromQuery] DateTime date)
        {
            // ดึง Forecast ทั้งวัน
            var forecasts = await _context.ApprovedForecasts
                .Where(x => x.TargetDate == date.Date)
                .OrderBy(x => x.StartTime)
                .ToListAsync();

            // ดึง Actual ทั้งวัน (อาจจะเยอะมาก ควร Group หรือ Filter)
            // ตัวอย่างนี้ดึงทุก 10 นาที เพื่อไม่ให้กราฟหนักเกินไป
            var actuals = await _context.ActualMachineLoads
                .Where(x => x.LogDateTime.Date == date.Date)
                .ToListAsync();

            // จัดรูปแบบข้อมูลสำหรับกราฟ (ขึ้นอยู่กับ Library หน้าบ้าน)
            // สร้างแกนเวลา 00:00 - 23:59
            var chartPoints = new List<object>();

            // *Simplification: ส่ง Raw Data ให้ Front-end ไป map เอง หรือทำ logic mapping ที่นี่*
            // ส่งไป 2 arrays ให้ง่ายต่อการ plot
            return Ok(new { 
                Forecasts = forecasts.Select(f => new { Time = f.StartTime, MW = f.FinalLoadMW }),
                Actuals = actuals.Select(a => new { Time = a.LogDateTime, MW = a.ActualLoadMW })
            });
        }
    }
}
```

#### Step 4: เพิ่ม Controller `SimulationController.cs` สำหรับดึงข้อมูล Simulation
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;
using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimulationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SimulationController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class SimInputDto
        {
            public decimal ActualLoadMW { get; set; }
        }

        [HttpPost("input")]
        public async Task<IActionResult> InputActual([FromBody] SimInputDto input)
        {
            var now = DateTime.Now;

            // 1. Save Actual Load
            var log = new ActualMachineLoad
            {
                LogDateTime = now,
                ActualLoadMW = input.ActualLoadMW
            };
            _context.ActualMachineLoads.Add(log);

            // 2. Logic: Check Diff
            var timeNow = now.TimeOfDay;
            var forecast = await _context.ApprovedForecasts
                 .Where(x => x.TargetDate == now.Date &&
                             x.StartTime <= timeNow &&
                             x.EndTime > timeNow)
                 .FirstOrDefaultAsync();

            if (forecast != null)
            {
                decimal diff = Math.Abs(input.ActualLoadMW - forecast.FinalLoadMW);
                decimal percent = (forecast.FinalLoadMW == 0) ? 0 : (diff / forecast.FinalLoadMW) * 100;

                // ดึง Config Threshold (30%)
                var thresholdConfig = await _context.NotificationConfigs
                    .FirstOrDefaultAsync(c => c.ConfigKey == "DiffThresholdPercent");
                decimal limit = thresholdConfig?.ConfigValue ?? 30;

                if (percent >= limit)
                {
                    // Trigger Alert Log
                    var alert = new AlertLog
                    {
                        AlertDateTime = now,
                        AlertType = "Warning",
                        Message = $"Actual Load ({input.ActualLoadMW}) differs from Forecast ({forecast.FinalLoadMW}) by {percent:F2}%",
                        ActualMW = input.ActualLoadMW,
                        ForecastMW = forecast.FinalLoadMW,
                        DiffPercent = percent,
                    };
                    _context.AlertLogs.Add(alert);
                    
                    // TODO: Call Line Notify API / Send Email here
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Data logged" });
        }
    }
}
```

#### Step 5: เพิ่ม Controller `ReportController.cs` สำหรับดึงข้อมูลรายงาน
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;
using System.Text;

namespace Hongsa.Rtms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportReport(int month, int year)
        {
            // ดึงข้อมูล Approved ของเดือนนั้น
            var data = await _context.ApprovedForecasts
                .Where(x => x.TargetDate.Month == month && x.TargetDate.Year == year)
                .OrderBy(x => x.TargetDate).ThenBy(x => x.StartTime)
                .ToListAsync();

            // สร้าง CSV แบบง่าย (หรือใช้ Library เช่น CsvHelper / EPPlus สำหรับ Excel)
            var csv = new StringBuilder();
            csv.AppendLine("Date,Start Time,End Time,Forecast Load (MW)");

            foreach (var item in data)
            {
                csv.AppendLine($"{item.TargetDate:yyyy-MM-dd},{item.StartTime},{item.EndTime},{item.FinalLoadMW}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var result = new FileContentResult(bytes, "text/csv")
            {
                FileDownloadName = $"Report_{year}_{month}.csv"
            };

            return result;
        }
    }
}
```

### React Backend Layout and Component Structure

- ศึกษาโครงสร้างของโปรเจกต์ React และการจัดระเบียบคอมโพเนนต์
- สร้าง Layout หลักสำหรับแอปพลิเคชัน Backend
- แยกคอมโพเนนต์ต่าง ๆ เช่น Sidebar, TopBar, และ Content Area

#### Step 6: ติดตั้ง chart library จาก shadcn/ui
```bash
npx shadcn@latest add chart
```

#### Step 7: ปรับสีของ chart ให้เข้ากับธีมของแอปพลิเคชัน ที่ไฟล์ `index.css`
```css
:root {
  --chart-1: oklch(92.165% 0.0824 162.588);
  --chart-2: oklch(0.6 0.118 184.704);
}
```

#### Step 8: สร้าง TopBar คอมโพเนนต์
- สร้างไฟล์ `TopBar.tsx` ในโฟลเดอร์ `components`
- เพิ่มปุ่มเมนูและข้อมูลผู้ใช้
```tsx
import { useState } from 'react'
import {useNavigate } from 'react-router'
import { 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  User, 
  ChevronDown,
} from 'lucide-react'

interface TopBarProps {
  onMenuClick: () => void
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Mock User Data (Replace with Context/Redux later)
  const adminUser = {
    name: "Somchai Engineer",
    role: "Admin",
    email: "somchai@hongsapower.com"
  }

//   const generalUser = {
//     name: "Somsak Operator",
//     role: "User",
//     email: "somsak@hongsapower.com"
//   }

  // Select active user here (Change to generalUser to test User role)
  const user = adminUser // Default is adminUser
  // const user = generalUser // Uncomment this line to use generalUser 

  const handleLogout = () => {
    // Clear tokens logic here
    navigate('/auth/login')
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm border-b border-slate-200 lg:px-6">
      {/* Left: Mobile Menu Trigger & Breadcrumb Mock */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="hidden text-lg font-semibold text-slate-800 sm:block">
          Backend Management
        </h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 hover:bg-slate-50 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <User size={18} />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-md font-medium text-slate-700 leading-none">{user.name}</p>
              <p className="text-sm text-slate-500 leading-none mt-1">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-slate-100 bg-white p-1 shadow-lg ring-opacity-5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-md font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-md text-slate-700 hover:bg-slate-100">
                  <Settings size={16} /> Account Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-md text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
```

#### Step 9: สร้าง Sidebar คอมโพเนนต์
- สร้างไฟล์ `Sidebar.tsx` ในโฟลเดอร์ `components`
- ใช้ React Router สำหรับการนำทางระหว่างหน้าต่าง ๆ
- เพิ่มเมนูที่เกี่ยวข้องกับการจัดการระบบ

```tsx
import { Link, useLocation } from 'react-router'
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileCheck2, 
  Activity, 
  FileBarChart, 
  Settings, 
  Zap,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation()
  
  // Mock Role - ในการใช้งานจริงควรดึงมาจาก Context หรือ Token
  // ลองเปลี่ยนเป็น "User" เพื่อดูผลลัพธ์
  const userRole: string = "Admin" 

  // Menu Configuration
  const menuItems = [
    { 
      category: "Monitoring",
      items: [
        { name: 'Dashboard', path: '/backend/dashboard', icon: LayoutDashboard },
        { name: 'Simulation Input', path: '/backend/simulation', icon: Activity },
      ]
    },
    { 
      category: "Planning & Forecast",
      items: [
        { name: 'Submit Plan', path: '/backend/planning', icon: CalendarDays },
        { name: 'Approval', path: '/backend/approval', icon: FileCheck2, badge: '3' }, // Badge example
      ]
    },
    { 
      category: "Reports",
      items: [
        { name: 'Monthly Report', path: '/backend/reports', icon: FileBarChart },
      ]
    },
    { 
      category: "System",
      items: [
        { name: 'User Management', path: '/backend/users', icon: Settings },
      ]
    }
  ]

  // Filter Menu based on Role
  const filteredMenuItems = menuItems.map(group => {
    const filteredItems = group.items.filter(item => {
      if (userRole === "User") {
        // User เห็นแค่ Dashboard และ Submit Plan
        return ["Dashboard", "Submit Plan"].includes(item.name)
      }
      if (userRole === "Admin") {
        // Admin เห็นทุกอย่าง ยกเว้น Submit Plan
        return item.name !== "Submit Plan"
      }
      return true
    })
    return { ...group, items: filteredItems }
  }).filter(group => group.items.length > 0)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link to="/backend/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span>Hongsa <span className="text-blue-400">RTMS</span></span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Menu Area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredMenuItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.category}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)} // Close on mobile click
                    className={`flex items-center justify-between rounded-md px-4 py-2 text-md font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
```

#### Step 10: สร้าง Layout หลัก
- สร้างไฟล์ `BackendLayout.tsx` ในโฟลเดอร์ `layouts`
- ใช้ Flexbox เพื่อจัดวาง Sidebar และ Content Area
- นำเข้า Sidebar และ TopBar คอมโพเนนต์

```tsx
import { useState } from "react"
import { Outlet } from "react-router"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"

function BackendLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default BackendLayout
```
#### Step 11: สร้างหน้า Page สำหรับ Backend
- สร้างโฟลเดอร์ `backend` ในโฟลเดอร์ `pages`
- สร้างไฟล์ `Dashboard.tsx`, `Planning.tsx`, `Approval.tsx`, `Reports.tsx`, `Users.tsx`, `Simulation.tsx` ในโฟลเดอร์ `backend`

ตัวอย่างหน้า Dashboard.tsx
```tsx
import { Activity, Bell, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  forecast: {
    label: "Forecast Load",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Actual Load",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const Dashboard = () => {
  const [data, setData] = useState(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, '0')}:00`,
      forecast: 80 + 20 * Math.sin((i / 24) * 2 * Math.PI),
      actual: 80 + Math.random() * 20 - 10,
    }))
  })

  useEffect(() => {
    document.title = "Dashboard | Hongsa Power RTMS"
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const lastItem = prevData[prevData.length - 1]
        const lastTimeHour = parseInt(lastItem.time.split(":")[0])
        const nextTimeHour = (lastTimeHour + 1) % 24
        const nextTime = `${nextTimeHour.toString().padStart(2, '0')}:00`

        // Simulate new values based on the last one to keep it smooth
        // Forecast stays the same (or cycles from the beginning if we want to keep the shape, 
        // but here we just want it static for the 24h window. 
        // However, since we are shifting time, we need to decide what the "new" forecast is.
        // If we want a static 24h forecast that doesn't change, we shouldn't be shifting the array.
        // But the requirement was "chart changes every 1 second".
        // If we want "Forecast doesn't change every second", maybe we mean the forecast curve is fixed 
        // and only actual updates?
        
        // Let's assume the user wants the Forecast line to be stable while Actual line updates.
        // To achieve "Forecast doesn't change every second" in a moving window, 
        // we usually just pick the forecast for the *next* hour from a pre-defined set.
        // For simplicity, let's just generate a new forecast that is consistent with a pattern 
        // or just keep the last one.
        
        // Let's make forecast follow a simple sine wave pattern based on time to look "static" relative to time of day
        const hour = nextTimeHour;
        const newForecast = 80 + 20 * Math.sin((hour / 24) * 2 * Math.PI);

        let newActual = lastItem.actual + (Math.random() * 10 - 5)
        newActual = Math.max(50, Math.min(118, newActual))

        const newItem = {
          time: nextTime,
          forecast: newForecast,
          actual: newActual,
        }

        // Remove first item and add new item
        return [...prevData.slice(1), newItem]
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Mock Data
  const stats = [
    {
      label: "Actual Load",
      value: `${data[data.length - 1].actual.toFixed(1)} MW`,
      change: "+12.0%",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Forecast Load",
      value: `${data[data.length - 1].forecast.toFixed(1)} MW`,
      change: "+2.5%",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "% Difference",
      value: `${Math.abs(((data[data.length - 1].actual - data[data.length - 1].forecast) / data[data.length - 1].forecast) * 100).toFixed(1)}%`,
      change: "Critical",
      icon: Bell,
      color: "text-red-600",
      bg: "bg-red-100",
      isAlert: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Real-Time Monitoring
        </h1>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>Last updated:</span>
          <span className="font-medium text-slate-700">
            {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 bg-white rounded-xl shadow-sm border ${
              stat.isAlert ? "border-red-200 bg-red-50/50" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.isAlert && (
                <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full animate-pulse">
                  ALERT
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3
                className={`text-3xl font-bold mt-1 ${
                  stat.isAlert ? "text-red-700" : "text-slate-800"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Load Trend (24 Hours)
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-chart-2 mr-2"></span>
              Actual
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-chart-1 mr-2"></span>
              Forecast
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 140]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="forecast"
                type="monotone"
                fill="var(--color-forecast)"
                fillOpacity={0.2}
                stroke="var(--color-forecast)"
                strokeWidth={2}
              />
              <Line
                dataKey="actual"
                type="monotone"
                stroke="var(--color-actual)"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

ตัวอย่างหน้า Planning.tsx
```tsx
import { useEffect, useState } from "react"
import { Plus, Trash2, Save, Calendar } from "lucide-react"

const Planning = () => {
  useEffect(() => {
    document.title = "Submit Plan | Hongsa Power RTMS"
  }, [])

  const [rows, setRows] = useState([
    { start: "00:00", end: "01:00", status: "Run Continuous" },
  ])

  const addRow = () => {
    setRows([...rows, { start: "00:00", end: "01:00", status: "Run Continuous" }])
  }

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  // Generate time options for every hour
  const timeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Submit Machine Plan
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-600">Revision:</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-bold">
            0
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {/* Date Selection */}
        <div className="mb-8 max-w-xs">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-hidden border border-slate-200 rounded-lg mb-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Machine Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={row.start}
                      className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={row.end}
                      className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2">
                      <option>Run Continuous</option>
                      <option>Not Run / Standby</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeRow(idx)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={addRow}
            className="flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Period
          </button>
          <button className="flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Save className="w-4 h-4 mr-2" /> Submit Plan
          </button>
        </div>
      </div>
    </div>
  )
}

export default Planning
```

ตัวอย่างหน้า Approval.tsx
```tsx
import { Check, X, Clock, User as UserIcon } from "lucide-react"
import { useEffect } from "react"

const Approval = () => {
  useEffect(() => {
    document.title = "Approval | Hongsa Power RTMS"
  }, [])

  // Mock Request Data
  const requests = [
    {
      id: 101,
      user: "Somchai Eng.",
      date: "09-Aug-2025",
      rev: 1,
      status: "Pending",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>

      {/* Request Card */}
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-slate-600">
                <UserIcon className="w-4 h-4 mr-1 text-slate-400" /> {req.user}
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="w-4 h-4 mr-1 text-slate-400" /> {req.date}{" "}
                (Rev {req.rev})
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
              {req.status}
            </span>
          </div>

          {/* Content Table */}
          <div className="p-6">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Time Period</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">System Calc. (MW)</th>
                  <th className="pb-3 font-medium w-40">Final MW (Edit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4">00:00 - 08:00</td>
                  <td>Run Continuous</td>
                  <td className="text-slate-500">
                    120.00{" "}
                    <span className="text-xs text-slate-400">(Max Load)</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue="120.00"
                      className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-4">08:00 - 24:00</td>
                  <td>Not Run</td>
                  <td className="text-slate-500">
                    0.50{" "}
                    <span className="text-xs text-slate-400">(Default)</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      defaultValue="0.50"
                      className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button className="flex items-center px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                <X className="w-4 h-4 mr-2" /> Return
              </button>
              <button className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors">
                <Check className="w-4 h-4 mr-2" /> Approve & Forecast
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Approval
```

ตัวอย่างหน้า Simulation.tsx
```tsx
import { useEffect, useState } from "react"
import { Send, RefreshCw } from "lucide-react"

const Simulation = () => {
  useEffect(() => {
    document.title = "Simulation | Hongsa Power RTMS"
  }, [])

  const [load, setLoad] = useState("")

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    alert(`Simulated Load: ${load} MW Sent!`)
    setLoad("")
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Simulation Input
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          ป้อนค่า Load จริง (MW) เพื่อจำลองสถานการณ์และทดสอบระบบแจ้งเตือน
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only">Actual Load (MW)</label>
            <div className="relative">
              <input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                placeholder="Enter Load (e.g., 75.5)"
                className="w-full text-center text-2xl font-bold p-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none transition-colors"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                MW
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Send Data</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Simulation
```

ตัวอย่างหน้า Reports.tsx
```tsx
import { Download, Filter } from "lucide-react"
import { useEffect } from "react"

const Reports = () => {
  useEffect(() => {
    document.title = "Monthly Report | Hongsa Power RTMS"
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Monthly Report</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">Filter:</span>
        </div>
        <select className="border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>August</option>
          <option>September</option>
        </select>
        <select className="border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>2025</option>
          <option>2024</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Forecast (MW)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Actual (MW)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                % Diff
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-sm text-slate-900">
                  09-Aug-2025
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">0{i}:00</td>
                <td className="px-6 py-4 text-sm text-right text-slate-700">
                  65.00
                </td>
                <td className="px-6 py-4 text-sm text-right text-slate-700">
                  75.00
                </td>
                <td className="px-6 py-4 text-sm text-right text-red-600 font-medium">
                  15.3%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center text-sm text-slate-500">
          Displaying 3 of 100 records
        </div>
      </div>
    </div>
  )
}

export default Reports
```

ตัวอย่างหน้า Users.tsx
```tsx
import { UserPlus, MoreVertical, Shield } from "lucide-react"
import { useEffect } from "react"

const Users = () => {
  useEffect(() => {
    document.title = "User Management | Hongsa Power RTMS"
  }, [])

  const users = [
    {
      id: 1,
      name: "Somchai Engineer",
      email: "somchai@hongsapower.com",
      role: "User",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin Manager",
      email: "admin@hongsapower.com",
      role: "Admin",
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm">
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "Admin" && (
                      <Shield className="w-3 h-3 mr-1" />
                    )}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
```

#### Step 12: ตั้งค่า Routes
- แก้ไขไฟล์ `index.tsx` หรือไฟล์ที่ใช้ตั้งค่า Routes
```tsx
import { createBrowserRouter, RouterProvider } from "react-router"

// Layout
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"
import BackendLayout from "@/layouts/BackendLayout"

// Frontend Pages
import Home from "@/pages/Home"
import About from "@/pages/About"

// Auth Pages
import Forgotpassword from "@/pages/Forgotpassword"
import Register from "@/pages/Register"
import Login from "@/pages/Login"

// Backend Pages
import Dashboard from "@/pages/backend/Dashboard"
import Simulation from "@/pages/backend/Simulation"
import Planning from "@/pages/backend/Planning"
import Approval from "@/pages/backend/Approval"
import Reports from "@/pages/backend/Reports"
import Users from "@/pages/backend/Users"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "about",
                element: <About />
            },
        ]
    },
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <Forgotpassword />
            }
        ]
    },
    {
        path: "backend",
        element: <BackendLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "simulation",
                element: <Simulation />
            },
            {
                path: "planning",
                element: <Planning />
            },
            {
                path: "approval",
                element: <Approval />
            },
            {
                path: "reports",
                element: <Reports />
            },
            {
                path: "users",
                element: <Users />
            }
        ]
    }
])

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}
```

#### Step 13: แก้ไข Login.tsx เก็บค่าลง Local Storage
```tsx
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authLogin, type LoginData } from "@/services/apiAuth"
import { toast } from "sonner"


function Login() {

  useEffect(() => {
    document.title = "Login | Hongsa Power RTMS";
  }, [])

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()

  const onSubmit = async (data: LoginData) => {
    console.log(data)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await authLogin(data)
      console.log("Login successful:", response)
      
      // Store Auth Data
      localStorage.setItem("token", response.token)
      localStorage.setItem("roles", JSON.stringify(response.roles))
      localStorage.setItem("username", data.username)
      localStorage.setItem("firstName", response.firstName)
      localStorage.setItem("lastName", response.lastName)
      
      toast.success("เข้าสู่ระบบสำเร็จ", {
        description: "ยินดีต้อนรับกลับ",
      })

      // Redirect to Dashboard
      navigate("/backend/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (error as any).response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      toast.error("เข้าสู่ระบบไม่สำเร็จ", {
        description: errorMessage,
      })
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ยินดีต้อนรับกลับ</h1>
        <p className="text-sm text-slate-500">
          เข้าสู่ระบบเพื่อจัดการข้อมูลสถานะเครื่องจักร
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>ชื่อผู้ใช้งาน (Username)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              id="username"
              {...register("username", { 
                required: "กรอกชื่อผู้ใช้งาน (username)" ,
                minLength: { 
                  value: 3, message: "ความยาวอย่างน้อย 3 ตัวอักษร" 
                }
              })}
              className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              placeholder="username" 
            />
          </div>
          {errors.username && <p className="text-red-500 text-xs">{errors.username.message as string}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>รหัสผ่าน (Password)</Label>
            <Button variant="link" className="text-xs" asChild>
              <Link to="/auth/forgot-password">
                ลืมรหัสผ่าน?
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              id="password"
              {...register("password", { 
                required: "กรอกรหัสผ่าน",
                minLength: { value: 8, message: "ความยาวอย่างน้อย 8 ตัวอักษร" } 
              })}
              className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
        </div>
        <Button type="submit" className="w-full group cursor-pointer">
          เข้าสู่ระบบ 
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">หรือ</span>
        </div>
      </div>

      <div className="text-center text-sm">
        ยังไม่มีบัญชีใช่ไหม?{" "}
        <Button variant="link" asChild>
          <Link to="/auth/register">
            ลงทะเบียนผู้ใช้งานใหม่
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Login
```

#### Step 14: แก้ไขหน้า TopBar.tsx ดึงค่าจาก Local Storage มาแสดง
```tsx
import { useState } from 'react'
import {useNavigate } from 'react-router'
import { 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  User, 
  ChevronDown,
} from 'lucide-react'

interface TopBarProps {
  onMenuClick: () => void
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Get User from LocalStorage
  const username = localStorage.getItem("username") || "User"
  const firstName = localStorage.getItem("firstName")
  const lastName = localStorage.getItem("lastName")
  
  const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : username

  const storedRoles = localStorage.getItem("roles")
  let role = "User"
  if (storedRoles) {
      try {
          const roles = JSON.parse(storedRoles)
          if (Array.isArray(roles) && roles.includes("Admin")) role = "Admin"
      } catch (e) {
        console.error(e)
      }
  }

  const user = {
    name: displayName,
    role: role,
    email: `${username}@hongsapower.com`
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("roles")
    localStorage.removeItem("username")
    localStorage.removeItem("firstName")
    localStorage.removeItem("lastName")
    navigate('/auth/login')
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm border-b border-slate-200 lg:px-6">
      {/* Left: Mobile Menu Trigger & Breadcrumb Mock */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h2 className="hidden text-lg font-semibold text-slate-800 sm:block">
          Backend Management
        </h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 hover:bg-slate-50 transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <User size={18} />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-md font-medium text-slate-700 leading-none">{user.name}</p>
              <p className="text-sm text-slate-500 leading-none mt-1">{user.role}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-slate-100 bg-white p-1 shadow-lg ring-opacity-5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-md font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-md text-slate-700 hover:bg-slate-100">
                  <Settings size={16} /> Account Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-md text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
```

#### Step 15: แก้ไขหน้า Sidebar.tsx ตรวจสอบสิทธิ์การเข้าถึงเมนู
```tsx
import { Link, useLocation } from 'react-router'
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileCheck2, 
  Activity, 
  FileBarChart, 
  Settings, 
  Zap,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation()
  
  // Get Role from LocalStorage
  const getUserRole = () => {
    const storedRoles = localStorage.getItem("roles")
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles)
        if (Array.isArray(roles) && roles.includes("Admin")) {
          return "Admin"
        }
      } catch (e) {
        console.error("Error parsing roles", e)
      }
    }
    return "User"
  }

  const userRole = getUserRole() 

  // Menu Configuration
  const menuItems = [
    { 
      category: "Monitoring",
      items: [
        { name: 'Dashboard', path: '/backend/dashboard', icon: LayoutDashboard },
        { name: 'Simulation Input', path: '/backend/simulation', icon: Activity },
      ]
    },
    { 
      category: "Planning & Forecast",
      items: [
        { name: 'Submit Plan', path: '/backend/planning', icon: CalendarDays },
        { name: 'Approval', path: '/backend/approval', icon: FileCheck2, badge: '3' }, // Badge example
      ]
    },
    { 
      category: "Reports",
      items: [
        { name: 'Monthly Report', path: '/backend/reports', icon: FileBarChart },
      ]
    },
    { 
      category: "System",
      items: [
        { name: 'User Management', path: '/backend/users', icon: Settings },
      ]
    }
  ]

  // Filter Menu based on Role
  const filteredMenuItems = menuItems.map(group => {
    const filteredItems = group.items.filter(item => {
      if (userRole === "User") {
        // User เห็นแค่ Dashboard และ Submit Plan
        return ["Dashboard", "Submit Plan"].includes(item.name)
      }
      if (userRole === "Admin") {
        // Admin เห็นทุกอย่าง ยกเว้น Submit Plan
        return item.name !== "Submit Plan"
      }
      return true
    })
    return { ...group, items: filteredItems }
  }).filter(group => group.items.length > 0)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link to="/backend/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span>Hongsa <span className="text-blue-400">RTMS</span></span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Menu Area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredMenuItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.category}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)} // Close on mobile click
                    className={`flex items-center justify-between rounded-md px-4 py-2 text-md font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
```
### Protect Backend Routes
#### Step 16: สร้าง component `ProtectedRoute.tsx` เพื่อป้องกันการเข้าถึงหน้า Backend โดยไม่ได้ล็อกอิน
```tsx
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
```

#### Step 17: แก้ไขไฟล์ Routes ใน `index.tsx` เพื่อใช้ `ProtectedRoute`
```tsx
import { createBrowserRouter, RouterProvider } from "react-router"

// Layout
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"
import BackendLayout from "@/layouts/BackendLayout"

// Frontend Pages
import Home from "@/pages/Home"
import About from "@/pages/About"

// Auth Pages
import Forgotpassword from "@/pages/Forgotpassword"
import Register from "@/pages/Register"
import Login from "@/pages/Login"

// Backend Pages
import Dashboard from "@/pages/backend/Dashboard"
import Simulation from "@/pages/backend/Simulation"
import Planning from "@/pages/backend/Planning"
import Approval from "@/pages/backend/Approval"
import Reports from "@/pages/backend/Reports"
import Users from "@/pages/backend/Users"
import ProtectedRoute from "@/components/ProtectedRoute"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "about",
                element: <About />
            },
        ]
    },
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <Forgotpassword />
            }
        ]
    },
    {
        path: "backend",
        element: <ProtectedRoute />,
        children: [
            {
                element: <BackendLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "simulation",
                        element: <Simulation />
                    },
                    {
                        path: "planning",
                        element: <Planning />
                    },
                    {
                        path: "approval",
                        element: <Approval />
                    },
                    {
                        path: "reports",
                        element: <Reports />
                    },
                    {
                        path: "users",
                        element: <Users />
                    }
                ]
            }
        ]
    }
])

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}
```

#### Step 18: สร้างไฟล์ `apiForecast.ts` 
สร้างไฟล์ `apiForecast.ts` ไว้ที่ `src/services` สำหรับเรียกใช้งาน API ดึงข้อมูลการอนุมัติแผนการผลิต 
```tsx
import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Types
export interface MachineStatusConfig {
  statusID: number
  statusName: string
  colorCode: string
  isRun: boolean
  defaultLoadMW?: number
}

export interface SubmitPlanItem {
  startTime: string
  endTime: string
  statusID: number
}

export interface SubmitPlanDto {
  targetDate: string // YYYY-MM-DD
  items: SubmitPlanItem[]
}

// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add Request Interceptor to include Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API Functions
export const getForecastConfig = async () => {
  const response = await api.get("/Forecast/config")
  return response.data // { machineStatus: [...] }
}

export const submitForecastPlan = async (data: SubmitPlanDto) => {
  const response = await api.post("/Forecast/submit", data)
  return response.data
}

// --- Approval & Admin ---

export interface ForecastRequest {
  requestID: number
  targetDate: string
  revisionNo: number
  requestStatus: string
  submittedBy: string
  submittedDate: string
  adminComment?: string
  submitter?: {
      firstName: string
      lastName: string
      userName: string
  }
  items?: {
      startTime: string
      endTime: string
      statusID: number
      statusConfig?: {
          statusName: string
      }
  }[]
}

export interface PreviewItem {
  startTime: string
  endTime: string
  statusID: number
  statusName: string
  calculatedMW: number
  sourceLogic: string
}

export interface ApproveItem {
  startTime: string
  endTime: string
  finalLoadMW: number
}

export interface ApprovePlanDto {
  requestID: number
  items: ApproveItem[]
}

export interface ReturnPlanDto {
  requestID: number
  comment: string
}

export const getPendingForecasts = async () => {
  const response = await api.get<ForecastRequest[]>("/Forecast/pending")
  return response.data
}

export const getForecastPreview = async (requestId: number) => {
  const response = await api.get<PreviewItem[]>(`/Forecast/${requestId}/preview`)
  return response.data
}

export const approveForecastPlan = async (data: ApprovePlanDto) => {
  const response = await api.post("/Forecast/approve", data)
  return response.data
}

export const returnForecastPlan = async (data: ReturnPlanDto) => {
  const response = await api.post("/Forecast/return", data)
  return response.data
}

export const getMyForecastHistory = async () => {
  const response = await api.get<ForecastRequest[]>("/Forecast/history")
  return response.data
}

export const getAllForecastHistory = async () => {
  const response = await api.get<ForecastRequest[]>("/Forecast/all-history")
  return response.data
}
```

#### Step 19: แก้ไขหน้า Planning.tsx
```tsx
import { useEffect, useState } from "react"
import { Plus, Trash2, Save, Calendar, Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { 
    getForecastConfig, 
    submitForecastPlan, 
    getMyForecastHistory,
    type MachineStatusConfig,
    type ForecastRequest
} from "@/services/apiForecast"

const Planning = () => {
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0])
  const [statusOptions, setStatusOptions] = useState<MachineStatusConfig[]>([])
  const [rows, setRows] = useState([
    { start: "00:00", end: "01:00", statusID: 1 },
  ])
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<ForecastRequest[]>([])

  useEffect(() => {
    document.title = "Submit Plan | Hongsa Power RTMS"
    fetchConfig()
    fetchHistory()
  }, [])

  const fetchConfig = async () => {
    try {
      const data = await getForecastConfig()
      // data.machineStatus is the array
      if (data.machineStatus && Array.isArray(data.machineStatus)) {
        setStatusOptions(data.machineStatus)
        // Update default statusID for existing rows if needed
        if (data.machineStatus.length > 0) {
           setRows(prev => prev.map(r => ({ ...r, statusID: data.machineStatus[0].statusID })))
        }
      }
    } catch (error) {
      console.error("Failed to fetch config", error)
      toast.error("Failed to load machine status options")
    }
  }

  const fetchHistory = async () => {
      try {
          const data = await getMyForecastHistory()
          setHistory(data)
      } catch (error) {
          console.error(error)
      }
  }

  const addRow = () => {
    const defaultStatus = statusOptions.length > 0 ? statusOptions[0].statusID : 1
    // Auto increment time logic (optional, but nice)
    const lastRow = rows[rows.length - 1]
    let nextStart = "00:00"
    let nextEnd = "01:00"
    
    if (lastRow) {
        nextStart = lastRow.end
        // Add 1 hour
        const [h] = lastRow.end.split(':').map(Number)
        const nextH = (h + 1) % 24
        nextEnd = `${nextH.toString().padStart(2, '0')}:00`
    }

    setRows([...rows, { start: nextStart, end: nextEnd, statusID: defaultStatus }])
  }

  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof typeof rows[0], value: string | number) => {
    setRows(prev => {
        const newRows = [...prev]
        newRows[index] = { ...newRows[index], [field]: value }
        return newRows
    })
  }

  const handleSubmit = async () => {
    if (!targetDate) {
        toast.error("Please select a target date")
        return
    }
    
    setLoading(true)
    try {
        const payload = {
            targetDate: targetDate,
            items: rows.map(r => ({
                startTime: r.start, // "00:00" -> TimeSpan parseable
                endTime: r.end,
                statusID: Number(r.statusID)
            }))
        }
        
        const result = await submitForecastPlan(payload)
        toast.success("Plan submitted successfully", {
            description: `Revision: ${result.revision}`
        })
        fetchHistory() // Refresh history
    } catch (error) {
        console.error(error)
        toast.error("Failed to submit plan")
    } finally {
        setLoading(false)
    }
  }

  // Filter history for selected date
  const selectedDateHistory = history.filter(h => h.targetDate.startsWith(targetDate))

  // Generate time options for every hour
  const timeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Submit Machine Plan
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-600">Revision:</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono font-bold">
            -
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        {/* Date Selection */}
        <div className="mb-8 max-w-xs">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-hidden border border-slate-200 rounded-lg mb-6">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Machine Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4">
                    <select
                      value={row.start}
                      onChange={(e) => updateRow(idx, 'start', e.target.value)}
                      className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={row.end}
                      onChange={(e) => updateRow(idx, 'end', e.target.value)}
                      className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                        value={row.statusID}
                        onChange={(e) => updateRow(idx, 'statusID', Number(e.target.value))}
                        className="block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-md p-2"
                    >
                      {statusOptions.map(opt => (
                          <option key={opt.statusID} value={opt.statusID}>
                              {opt.statusName}
                          </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeRow(idx)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={addRow}
            className="flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Period
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" /> 
            {loading ? "Submitting..." : "Submit Plan"}
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Submission History ({targetDate})</h2>
        
        {selectedDateHistory.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                No submissions found for this date.
            </div>
        ) : (
            <div className="space-y-4">
                {selectedDateHistory.map((req) => (
                    <div key={req.requestID} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <span className="font-mono font-bold text-slate-700">Rev {req.revisionNo}</span>
                                <span className="text-xs text-slate-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(req.submittedDate).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                {req.requestStatus === 'Pending' && (
                                    <span className="flex items-center text-yellow-600 text-xs font-bold uppercase bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                                    </span>
                                )}
                                {req.requestStatus === 'Approved' && (
                                    <span className="flex items-center text-emerald-600 text-xs font-bold uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                                    </span>
                                )}
                                {req.requestStatus === 'Returned' && (
                                    <span className="flex items-center text-red-600 text-xs font-bold uppercase bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                        <XCircle className="w-3 h-3 mr-1" /> Returned
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {req.requestStatus === 'Returned' && req.adminComment && (
                            <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-sm text-red-700">
                                <strong>Admin Comment:</strong> {req.adminComment}
                            </div>
                        )}

                        <div className="p-4">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-100">
                                        <th className="pb-2 font-medium">Time</th>
                                        <th className="pb-2 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {req.items?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 text-slate-600">{item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}</td>
                                            <td className="py-2 font-medium text-slate-800">{item.statusConfig?.statusName || item.statusID}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default Planning
```

#### Step 20: แก้ไขหน้า `Approval.tsx`
```tsx
import { useEffect, useState } from "react"
import { Check, X, Clock, User as UserIcon, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { 
    getPendingForecasts, 
    getForecastPreview, 
    approveForecastPlan, 
    returnForecastPlan,
    getAllForecastHistory,
    type ForecastRequest,
    type PreviewItem 
} from "@/services/apiForecast"

// Sub-component for individual request card
const ApprovalCard = ({ request, onProcessed }: { request: ForecastRequest, onProcessed: () => void }) => {
    const [items, setItems] = useState<PreviewItem[]>([])
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [finalValues, setFinalValues] = useState<Record<string, number>>({}) // Key: startTime, Value: finalMW

    const fetchDetails = async () => {
        setLoading(true)
        try {
            const data = await getForecastPreview(request.requestID)
            setItems(data)
            // Initialize final values with calculated values
            const initialFinals: Record<string, number> = {}
            data.forEach(item => {
                initialFinals[item.startTime] = item.calculatedMW
            })
            setFinalValues(initialFinals)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load preview details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (expanded && items.length === 0) {
            fetchDetails()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded])

    const handleApprove = async () => {
        try {
            const payload = {
                requestID: request.requestID,
                items: items.map(item => ({
                    startTime: item.startTime,
                    endTime: item.endTime,
                    finalLoadMW: finalValues[item.startTime] ?? item.calculatedMW
                }))
            }
            await approveForecastPlan(payload)
            toast.success("Plan approved successfully")
            onProcessed()
        } catch (error) {
            console.error(error)
            toast.error("Failed to approve plan")
        }
    }

    const handleReturn = async () => {
        // Simple prompt for comment for now
        const comment = prompt("Enter return reason:")
        if (!comment) return

        try {
            await returnForecastPlan({ requestID: request.requestID, comment })
            toast.success("Plan returned")
            onProcessed()
        } catch (error) {
            console.error(error)
            toast.error("Failed to return plan")
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             {/* Header - Click to expand */}
             <div 
                className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setExpanded(!expanded)}
             >
                <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-600">
                        <UserIcon className="w-4 h-4 mr-1 text-slate-400" /> 
                        {request.submitter?.firstName} {request.submitter?.lastName} ({request.submitter?.userName})
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-1 text-slate-400" /> 
                        {new Date(request.targetDate).toLocaleDateString()} (Rev {request.revisionNo})
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
                        {request.requestStatus}
                    </span>
                    {expanded ? <ChevronUp size={18} className="text-slate-400"/> : <ChevronDown size={18} className="text-slate-400"/>}
                </div>
             </div>

             {/* Content */}
             {expanded && (
                 <div className="p-6">
                    {loading ? (
                        <div className="text-center py-4 text-slate-500">Loading details...</div>
                    ) : (
                        <>
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-100">
                                        <th className="pb-3 font-medium">Time Period</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">System Calc. (MW)</th>
                                        <th className="pb-3 font-medium w-40">Final MW (Edit)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4">{item.startTime} - {item.endTime}</td>
                                            <td>{item.statusName}</td>
                                            <td className="text-slate-500">
                                                {item.calculatedMW.toFixed(2)}{" "}
                                                <span className="text-xs text-slate-400">({item.sourceLogic})</span>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={finalValues[item.startTime] ?? ''}
                                                    onChange={(e) => setFinalValues({...finalValues, [item.startTime]: parseFloat(e.target.value)})}
                                                    className="w-full px-2 py-1 border border-slate-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-8 flex justify-end space-x-3">
                                <button 
                                    onClick={handleReturn}
                                    className="flex items-center px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <X className="w-4 h-4 mr-2" /> Return
                                </button>
                                <button 
                                    onClick={handleApprove}
                                    className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Approve & Forecast
                                </button>
                            </div>
                        </>
                    )}
                 </div>
             )}
        </div>
    )
}

const Approval = () => {
    const [requests, setRequests] = useState<ForecastRequest[]>([])
    const [history, setHistory] = useState<ForecastRequest[]>([])

    const fetchRequests = async () => {
        try {
            const data = await getPendingForecasts()
            setRequests(data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load pending requests")
        }
    }

    const fetchHistory = async () => {
        try {
            const data = await getAllForecastHistory()
            // Filter out Pending ones as they are already shown above
            setHistory(data.filter(r => r.requestStatus !== 'Pending'))
        } catch (error) {
            console.error(error)
        }
    }

    const refreshAll = () => {
        fetchRequests()
        fetchHistory()
    }

    useEffect(() => {
        document.title = "Admin Approval | Hongsa Power RTMS"
        refreshAll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <h1 className="text-2xl font-bold text-slate-800">Pending Approvals</h1>
                {requests.length === 0 && <p className="text-slate-500 italic">No pending requests.</p>}
                {requests.map(req => (
                    <ApprovalCard key={req.requestID} request={req} onProcessed={refreshAll} />
                ))}
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 border-t border-slate-200 pt-6">Approval History</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Date</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Submitter</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Rev</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-slate-500">Action Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No history found.</td>
                                </tr>
                            ) : (
                                history.map(req => (
                                    <tr key={req.requestID} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            {new Date(req.targetDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {req.submitter?.firstName} {req.submitter?.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {req.revisionNo}
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.requestStatus === 'Approved' && (
                                                <span className="inline-flex items-center text-emerald-600 text-xs font-bold uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                                                </span>
                                            )}
                                            {req.requestStatus === 'Returned' && (
                                                <span className="inline-flex items-center text-red-600 text-xs font-bold uppercase bg-red-50 px-2 py-1 rounded-full border border-red-200">
                                                    <XCircle className="w-3 h-3 mr-1" /> Returned
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {/* Assuming we have reviewedDate or similar, using submittedDate for now if not available in interface */}
                                            {new Date(req.submittedDate).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Approval
```

#### Step 21: แก้ไขหน้า `Sidebar.tsx` เพื่ออัพเดทจำนวน badge ของการอนุมัติ
```tsx
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileCheck2, 
  Activity, 
  FileBarChart, 
  Settings, 
  Zap,
  X
} from 'lucide-react'
import { getPendingForecasts } from '@/services/apiForecast'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation()
  const [pendingCount, setPendingCount] = useState(0)
  
  // Get Role from LocalStorage
  const getUserRole = () => {
    const storedRoles = localStorage.getItem("roles")
    if (storedRoles) {
      try {
        const roles = JSON.parse(storedRoles)
        if (Array.isArray(roles) && roles.includes("Admin")) {
          return "Admin"
        }
      } catch (e) {
        console.error("Error parsing roles", e)
      }
    }
    return "User"
  }

  const userRole = getUserRole() 

  useEffect(() => {
    if (userRole === 'Admin') {
        const fetchCount = async () => {
            try {
                const data = await getPendingForecasts()
                setPendingCount(data.length)
            } catch (error) {
                console.error("Failed to fetch pending count", error)
            }
        }
        fetchCount()
        
        // Poll every 30 seconds
        const interval = setInterval(fetchCount, 30000)
        return () => clearInterval(interval)
    }
  }, [userRole])

  // Menu Configuration
  const menuItems = [
    { 
      category: "Monitoring",
      items: [
        { name: 'Dashboard', path: '/backend/dashboard', icon: LayoutDashboard },
        { name: 'Simulation Input', path: '/backend/simulation', icon: Activity },
      ]
    },
    { 
      category: "Planning & Forecast",
      items: [
        { name: 'Submit Plan', path: '/backend/planning', icon: CalendarDays },
        { name: 'Approval', path: '/backend/approval', icon: FileCheck2, badge: pendingCount > 0 ? pendingCount.toString() : undefined },
      ]
    },
    { 
      category: "Reports",
      items: [
        { name: 'Monthly Report', path: '/backend/reports', icon: FileBarChart },
      ]
    },
    { 
      category: "System",
      items: [
        { name: 'User Management', path: '/backend/users', icon: Settings },
      ]
    }
  ]

  // Filter Menu based on Role
  const filteredMenuItems = menuItems.map(group => {
    const filteredItems = group.items.filter(item => {
      if (userRole === "User") {
        // User เห็นแค่ Dashboard และ Submit Plan
        return ["Dashboard", "Submit Plan"].includes(item.name)
      }
      if (userRole === "Admin") {
        // Admin เห็นทุกอย่าง ยกเว้น Submit Plan
        return item.name !== "Submit Plan"
      }
      return true
    })
    return { ...group, items: filteredItems }
  }).filter(group => group.items.length > 0)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <Link to="/backend/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span>Hongsa <span className="text-blue-400">RTMS</span></span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Menu Area */}
        <div className="h-[calc(100vh-64px)] overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredMenuItems.map((group, idx) => (
            <div key={idx}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.category}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)} // Close on mobile click
                    className={`flex items-center justify-between rounded-md px-4 py-2 text-md font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
```

#### Step 22: แก้ไขหน้า `Dashboard.tsx` เพื่อแสดงจำนวนการอนุมัติที่รออยู่
```tsx
import { Activity, Bell, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import axios from "axios"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  forecast: {
    label: "Forecast Load",
    color: "var(--chart-1)",
  },
  actual: {
    label: "Actual Load",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface DashboardStats {
  actualMW: number;
  forecastMW: number;
  diffPercent: number;
  lastUpdate: string | null;
}

interface ChartDataItem {
  time: string;
  mw: number;
}

interface ChartResponse {
  forecasts: ChartDataItem[];
  actuals: ChartDataItem[];
}

interface ProcessedChartData {
  time: string;
  forecast: number | null;
  actual: number | null;
}

const Dashboard = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({
    actualMW: 0,
    forecastMW: 0,
    diffPercent: 0,
    lastUpdate: null
  });

  const [chartData, setChartData] = useState<ProcessedChartData[]>([]);

  useEffect(() => {
    document.title = "Dashboard | Hongsa Power RTMS"

    const processChartData = (data: ChartResponse) => {
      // Create a map for 24 hours (00:00 - 23:00)
      const timeMap = new Map<string, ProcessedChartData>();
  
      // Initialize with empty slots if needed, or just build from data
      // Let's build 00:00 to 23:00
      for (let i = 0; i < 24; i++) {
        const timeKey = `${i.toString().padStart(2, '0')}:00`;
        timeMap.set(timeKey, { time: timeKey, forecast: null, actual: null });
      }
  
      // Fill Forecasts (Time is "hh:mm:ss")
      data.forecasts.forEach((item) => {
        const timeKey = item.time.substring(0, 5); // "00:00:00" -> "00:00"
        if (timeMap.has(timeKey)) {
          const entry = timeMap.get(timeKey)!;
          entry.forecast = item.mw;
        }
      });
  
      // Fill Actuals (Time is ISO DateTime)
      data.actuals.forEach((item) => {
        const date = new Date(item.time);
        const timeKey = `${date.getHours().toString().padStart(2, '0')}:00`; 
        
        if (timeMap.has(timeKey)) {
          const entry = timeMap.get(timeKey)!;
          entry.actual = item.mw;
        }
      });
  
      const processed = Array.from(timeMap.values());
      setChartData(processed);
    };

    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
        // 1. Get Stats
        const statsRes = await axios.get("http://localhost:5000/api/Monitor/dashboard-stats", { headers });
        setStatsData(statsRes.data);
  
        // 2. Get Chart Data
        const chartRes = await axios.get(`http://localhost:5000/api/Monitor/chart-data?date=${today}`, { headers });
        
        processChartData(chartRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [])

  // Stats Display
  const stats = [
    {
      label: "Actual Load",
      value: `${statsData.actualMW.toFixed(2)} MW`,
      change: "Real-time",
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Forecast Load",
      value: `${statsData.forecastMW.toFixed(2)} MW`,
      change: "Target",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "% Difference",
      value: `${statsData.diffPercent.toFixed(2)}%`,
      change: statsData.diffPercent > 5 ? "Critical" : "Normal",
      icon: Bell,
      color: statsData.diffPercent > 5 ? "text-red-600" : "text-slate-600",
      bg: statsData.diffPercent > 5 ? "bg-red-100" : "bg-slate-100",
      isAlert: statsData.diffPercent > 5,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Real-Time Monitoring
        </h1>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <span>Last updated:</span>
          <span className="font-medium text-slate-700">
            {statsData.lastUpdate ? new Date(statsData.lastUpdate).toLocaleString() : "-"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 bg-white rounded-xl shadow-sm border ${
              stat.isAlert ? "border-red-200 bg-red-50/50" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.isAlert && (
                <span className="px-2 py-1 text-xs font-bold text-red-600 bg-red-100 rounded-full animate-pulse">
                  ALERT
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3
                className={`text-3xl font-bold mt-1 ${
                  stat.isAlert ? "text-red-700" : "text-slate-800"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Load Trend (24 Hours)
          </h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-chart-2 mr-2"></span>
              Actual
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-chart-1 mr-2"></span>
              Forecast
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ComposedChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 'auto']} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="forecast"
                type="monotone"
                fill="var(--color-forecast)"
                fillOpacity={0.2}
                stroke="var(--color-forecast)"
                strokeWidth={2}
              />
              <Line
                dataKey="actual"
                type="monotone"
                stroke="var(--color-actual)"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

#### Step 23: กลับไปเพิ่ม `SimulationWorker.cs` ในโปรเจคต์ Backend
```csharp
using Hongsa.Rtms.Api.Data;
using Hongsa.Rtms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hongsa.Rtms.Api.Services
{
    public class SimulationWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SimulationWorker> _logger;

        public SimulationWorker(IServiceProvider serviceProvider, ILogger<SimulationWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Simulation Worker Started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await DoWorkAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in Simulation Worker");
                }

                // รอ 1 นาที (60,000 ms) ก่อนทำงานรอบถัดไป
                await Task.Delay(60000, stoppingToken);
            }
        }

        private async Task DoWorkAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var now = DateTime.Now;
                var timeNow = now.TimeOfDay;

                // 1. จำลองค่า Actual Load (Machine Running Always)
                // โจทย์: เครื่องจักร Run ตลอด และค่าไม่เกิน 120 MW
                var random = new Random();
                
                // สุ่มค่าพื้นฐานในช่วง 80 - 119 (เพื่อให้เป็นช่วง Run ที่สมจริง)
                decimal simulatedLoad = random.Next(80, 120); 
                
                // เพิ่มทศนิยมเพื่อให้ข้อมูลดูเป็นธรรมชาติ
                simulatedLoad += (decimal)random.NextDouble();

                // ตรวจสอบขั้นสุดท้าย: ห้ามเกิน 120.00 MW เด็ดขาด
                if (simulatedLoad > 120.00m) 
                {
                    simulatedLoad = 120.00m;
                }
                
                // ปัดเศษทศนิยม 2 ตำแหน่ง
                simulatedLoad = Math.Round(simulatedLoad, 2);

                // 2. บันทึก Actual Load ลง Database
                var log = new ActualMachineLoad
                {
                    LogDateTime = now,
                    ActualLoadMW = simulatedLoad
                };
                context.ActualMachineLoads.Add(log);

                // 3. ตรวจสอบ Alert Condition (ยังคง Logic เดิมไว้เพื่อแจ้งเตือนหาก Diff เกิน)
                // ดึงแผน (Forecast) มาเทียบ (ถ้ามี)
                var forecast = await context.ApprovedForecasts
                    .AsNoTracking()
                    .Where(x => x.TargetDate == now.Date &&
                                x.StartTime <= timeNow &&
                                x.EndTime > timeNow)
                    .FirstOrDefaultAsync();

                if (forecast != null && forecast.FinalLoadMW > 0)
                {
                    decimal diff = Math.Abs(simulatedLoad - forecast.FinalLoadMW);
                    decimal percent = (diff / forecast.FinalLoadMW) * 100;

                    // ดึง Config Threshold
                    var thresholdConfig = await context.NotificationConfigs
                        .FirstOrDefaultAsync(c => c.ConfigKey == "DiffThresholdPercent");
                    decimal limit = thresholdConfig?.ConfigValue ?? 30;

                    if (percent >= limit)
                    {
                        var alert = new AlertLog
                        {
                            AlertDateTime = now,
                            AlertType = "Warning",
                            Message = $"Actual ({simulatedLoad:F2}) vs Forecast ({forecast.FinalLoadMW:F2}) Diff {percent:F2}%",
                            ActualMW = simulatedLoad,
                            ForecastMW = forecast.FinalLoadMW,
                            DiffPercent = percent,
                            Recipient = "Admin Group"
                        };
                        context.AlertLogs.Add(alert);
                        
                        _logger.LogWarning($"[ALERT] Load Diff {percent:F2}% Detected!");
                    }
                }

                await context.SaveChangesAsync();
                _logger.LogInformation($"[SIMULATION] Logged Actual: {simulatedLoad} MW at {now}");
            }
        }
    }
}
```