using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 4. Final Data (Approved)
// for Approved Forecasts
public class ApprovedForecast
{
    [Key]
    public int ForecastID { get; set; }
    public DateTime TargetDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int StatusID { get; set; }
    public decimal CalculatedLoadMW { get; set; }
    public decimal FinalLoadMW { get; set; }
    public bool IsAdminEdited { get; set; }
    public int? SourceRequestID { get; set; }
}