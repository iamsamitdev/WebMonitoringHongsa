namespace Hongsa.Rtms.Api.DTOs;

// DTO สำหรับแต่ละรายการที่ Admin อนุมัติ
public class ApprovedItemDto
{
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public decimal FinalLoadMW { get; set; }
}