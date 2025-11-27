using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 3. Transaction Detail
// for Forecast Request Items
public class ForecastRequestItem
{
    [Key]
    public int ItemID { get; set; }
    public int RequestID { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int StatusID { get; set; }
    
    [ForeignKey("StatusID")]
    public virtual MachineStatusConfig? StatusConfig { get; set; }
}