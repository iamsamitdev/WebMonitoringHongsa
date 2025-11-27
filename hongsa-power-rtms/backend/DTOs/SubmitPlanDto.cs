namespace Hongsa.Rtms.Api.DTOs;

// DTO สำหรับรับข้อมูลการส่งคำขอพยากรณ์ (Forecast Request)
public class SubmitPlanDto
{
    public DateTime TargetDate { get; set; }
    public List<PlanItemDto> Items { get; set; } = new();
}