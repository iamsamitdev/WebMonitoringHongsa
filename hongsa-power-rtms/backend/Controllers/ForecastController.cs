using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;
using Hongsa.Rtms.Api.Models;
using Hongsa.Rtms.Api.DTOs;
using System.Security.Claims;

namespace Hongsa.Rtms.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ForecastController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ForecastController(ApplicationDbContext context)
    {
        _context = context;
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
        // if (userId == null) return Unauthorized();
        
        // กรณี Dev/Test: ถ้าไม่ได้ Login ให้ใช้ User คนแรกใน DB แทน
        if (userId == null)
        {
            var firstUser = await _context.Users.FirstOrDefaultAsync();
            if (firstUser != null) userId = firstUser.Id;
            else return Unauthorized("No user found in database. Please register a user first.");
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
        // if (adminId == null) return Unauthorized("No user found in database.");
        
        // กรณี Dev/Test: ถ้าไม่ได้ Login ให้ใช้ User คนแรกใน DB แทน
        if (adminId == null)
        {
            var firstUser = await _context.Users.FirstOrDefaultAsync();
            if (firstUser != null) adminId = firstUser.Id;
            else return Unauthorized("No user found in database.");
        }

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

        var request = await _context.ForecastRequests.FindAsync(dto.RequestID);
        if (request == null) return NotFound();

        request.RequestStatus = "Returned";
        request.AdminComment = dto.Comment;
        request.ReviewedBy = adminId;
        request.ReviewedDate = DateTime.Now;

        await _context.SaveChangesAsync();

        // TODO: Trigger Email Service Here
        // _emailService.SendReturnEmail(request.SubmittedBy, dto.Comment);

        return Ok(new { Message = "Plan Returned" });
    }
}