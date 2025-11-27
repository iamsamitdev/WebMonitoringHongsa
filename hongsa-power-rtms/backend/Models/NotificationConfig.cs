using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 7. Notification Configurations
// for Alert Thresholds
public class NotificationConfig
{
    [Key]
    public int ConfigID { get; set; }
    public string ConfigKey { get; set; } = string.Empty;
    public decimal ConfigValue { get; set; }
}