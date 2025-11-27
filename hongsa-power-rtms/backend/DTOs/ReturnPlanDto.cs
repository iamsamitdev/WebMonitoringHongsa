namespace Hongsa.Rtms.Api.DTOs;

// DTO สำหรับการส่งคืนพยากรณ์โดย Admin
public class ReturnPlanDto
{
    public int RequestID { get; set; }
    public string Comment { get; set; } = string.Empty;
}