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
            TargetDate = dto.TargetDate.Date, // Force Date only
            RevisionNo = nextRev,
            RequestStatus = "Pending",
            SubmittedBy = userId,
            SubmittedDate = DateTime.Now
        };

        // Map Items
        foreach (var item in dto.Items)
        {
            // Handle 24:00 (End of Day) manually because TimeSpan.Parse might fail or SQL 'time' type doesn't support it
            TimeSpan startT = (item.StartTime == "24:00") ? new TimeSpan(23, 59, 59) : TimeSpan.Parse(item.StartTime);
            TimeSpan endT = (item.EndTime == "24:00") ? new TimeSpan(23, 59, 59) : TimeSpan.Parse(item.EndTime);

            request.Items.Add(new ForecastRequestItem
            {
                StartTime = startT,
                EndTime = endT,
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
        
        // 1. ดึง Request ที่กำลังจะ Approve
        var request = await _context.ForecastRequests
            .Include(r => r.Items) // ดึง Items มาด้วยเพื่อเช็ค StatusID
            .FirstOrDefaultAsync(r => r.RequestID == dto.RequestID);

        if (request == null) return NotFound("Request not found");

        // ==================================================================================
        // STEP 1: หา Max Actual Load ของวันนั้น (จาก ActualMachineLoad) และ Update DailyMaxLoadStats
        // ==================================================================================
        
        // หาค่าสูงสุดจาก Log ของวันที่ TargetDate
        var maxActualLoad = await _context.ActualMachineLoads
            .Where(x => x.LogDateTime.Date == request.TargetDate.Date)
            .MaxAsync(x => (decimal?)x.ActualLoadMW) ?? 0; // ถ้าไม่มีข้อมูลให้เป็น 0

        // เช็คว่ามีสถิติของวันนี้หรือยัง
        var existingStat = await _context.DailyMaxLoadStats
            .FirstOrDefaultAsync(s => s.StatDate == request.TargetDate.Date);

        if (existingStat != null)
        {
            // มีแล้ว -> Update
            existingStat.MaxLoadMW = maxActualLoad;
            existingStat.RecordedAt = DateTime.Now;
            _context.DailyMaxLoadStats.Update(existingStat);
        }
        else
        {
            // ยังไม่มี -> Insert
            _context.DailyMaxLoadStats.Add(new DailyMaxLoadStats
            {
                StatDate = request.TargetDate.Date,
                MaxLoadMW = maxActualLoad,
                RecordedAt = DateTime.Now
            });
        }
        
        // บันทึก Stat ลง DB ก่อนเพื่อความชัวร์
        await _context.SaveChangesAsync(); 


        // ==================================================================================
        // STEP 2: Update Status ของ Request เป็น Approved
        // ==================================================================================
        request.RequestStatus = "Approved";
        request.ReviewedBy = adminId;
        request.ReviewedDate = DateTime.Now;


        // ==================================================================================
        // STEP 3: สร้างข้อมูลลง ApprovedForecasts ตามเงื่อนไข StatusID
        // ==================================================================================

        // 3.1 ลบข้อมูลเก่าของวันนี้ทิ้งก่อน (กรณี Re-Approve)
        var oldApproved = _context.ApprovedForecasts.Where(a => a.TargetDate == request.TargetDate);
        _context.ApprovedForecasts.RemoveRange(oldApproved);

        // 3.2 ดึง Config ค่า Default (สำหรับ StatusID = 0)
        var notRunConfig = await _context.MachineStatusConfigs.FirstOrDefaultAsync(c => c.StatusID == 0);
        decimal defaultLoad = notRunConfig?.DefaultLoadMW ?? 0.50m; // ถ้าหาไม่เจอใช้ 0.50

        // 3.3 วนลูป Items เพื่อสร้าง Final Forecast
        foreach (var item in request.Items)
        {
            decimal finalMW = 0;

            // --- LOGIC ตามเงื่อนไข ---
            if (item.StatusID == 1) 
            {
                // StatusID 1 (Run): ใช้ MaxLoad ที่หามาได้
                finalMW = maxActualLoad;
            }
            else if (item.StatusID == 0)
            {
                // StatusID 0 (Not Run): ใช้ DefaultLoad (0.50)
                finalMW = defaultLoad;
            }
            
            // *หมายเหตุ: หาก Admin มีการแก้ไขค่าเองจากหน้าเว็บ (dto.Items) อาจต้องเช็คตรงนี้
            // แต่ตาม Logic ที่ให้มาคือให้ Auto Calculate จาก DB
            // ถ้าต้องการรับค่าที่ Admin แก้มาด้วย ให้ใช้: 
            // var manualEdit = dto.Items.FirstOrDefault(x => x.StartTime == item.StartTime.ToString());
            // if (manualEdit != null) finalMW = manualEdit.FinalLoadMW;

            _context.ApprovedForecasts.Add(new ApprovedForecast
            {
                TargetDate = request.TargetDate.Date, // Force Date only
                StartTime = item.StartTime,
                EndTime = item.EndTime,
                StatusID = item.StatusID,
                CalculatedLoadMW = finalMW, // ค่าที่ระบบคำนวณได้
                FinalLoadMW = finalMW,      // ค่าสุดท้ายที่จะใช้จริง
                IsAdminEdited = false,      // เป็น Auto logic
                SourceRequestID = request.RequestID
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new { Message = "Plan Approved and Forecast Generated", MaxLoadUsed = maxActualLoad });
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