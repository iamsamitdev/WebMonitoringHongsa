using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 6. Actual Machine Load Logs
// for Actual Load Data Logging
public class ActualMachineLoad
{
    [Key]
    public long LogID { get; set; }
    public DateTime LogDateTime { get; set; }
    public decimal ActualLoadMW { get; set; }
}