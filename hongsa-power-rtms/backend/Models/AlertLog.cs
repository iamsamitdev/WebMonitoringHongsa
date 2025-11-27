using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 8. Alert Logs
// for Alert History
public class AlertLog
{
    [Key]
    public long AlertID { get; set; }
    public DateTime AlertDateTime { get; set; } = DateTime.Now;
    public string? AlertType { get; set; }
    public string? Message { get; set; }
    public decimal ActualMW { get; set; }
    public decimal ForecastMW { get; set; }
    public decimal DiffPercent { get; set; }
}