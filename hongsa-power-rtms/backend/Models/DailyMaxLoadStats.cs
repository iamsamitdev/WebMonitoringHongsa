using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 5. Stats & Logs
// for Daily Max Load Statistics
public class DailyMaxLoadStats
{
    [Key]
    public DateTime StatDate { get; set; }
    public decimal MaxLoadMW { get; set; }
    public DateTime RecordedAt { get; set; } = DateTime.Now;
}