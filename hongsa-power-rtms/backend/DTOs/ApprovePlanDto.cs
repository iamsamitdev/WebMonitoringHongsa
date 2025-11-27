namespace Hongsa.Rtms.Api.DTOs;

// DTO สำหรับการอนุมัติพยากรณ์โดย Admin
public class ApprovePlanDto
{
    public int RequestID { get; set; }
    public List<ApprovedItemDto> Items { get; set; } = new();
}