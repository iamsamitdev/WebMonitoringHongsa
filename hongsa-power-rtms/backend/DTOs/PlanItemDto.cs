namespace Hongsa.Rtms.Api.DTOs;

// DTO สำหรับแต่ละรายการในคำขอพยากรณ์
public class PlanItemDto
{
    public string StartTime { get; set; } = string.Empty; // รูปแบบ "HH:mm"
    public string EndTime { get; set; } = string.Empty;   // รูปแบบ "HH:mm"
    public int StatusID { get; set; }
}