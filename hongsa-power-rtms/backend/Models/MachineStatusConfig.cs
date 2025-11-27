using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 1. Master Data
// for Machine Status Configurations
public class MachineStatusConfig
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int StatusID { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public decimal? DefaultLoadMW { get; set; }
}