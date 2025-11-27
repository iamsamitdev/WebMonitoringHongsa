namespace Hongsa.Rtms.Api.DTOs;

// DTO สำหรับผลลัพธ์การพรีวิว
public class PreviewResultDto
{
    public string StartTime { get; set; } = string.Empty; // รูปแบบ "HH:mm"
    public string EndTime { get; set; } = string.Empty;   // รูปแบบ "HH:mm"
    public int StatusID { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public decimal CalculatedMW { get; set; }
    public string SourceLogic { get; set; } = string.Empty;
}