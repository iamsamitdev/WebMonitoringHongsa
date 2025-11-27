using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hongsa.Rtms.Api.Models;

// 2. Transaction Header
// for Forecast Requests
public class ForecastRequest
{
    [Key]
    public int RequestID { get; set; }
    public DateTime TargetDate { get; set; }
    public int RevisionNo { get; set; }
    public string RequestStatus { get; set; } = "Pending"; // Draft, Pending, Approved, Returned

    [ForeignKey("Submitter")]
    public string SubmittedBy { get; set; } = string.Empty;
    public virtual ApplicationUser? Submitter { get; set; } // Link to your Identity User
    public DateTime SubmittedDate { get; set; } = DateTime.Now;

    public string? AdminComment { get; set; }

    [ForeignKey("Reviewer")]
    public string? ReviewedBy { get; set; }
    public virtual ApplicationUser? Reviewer { get; set; }
    public DateTime? ReviewedDate { get; set; }

    public virtual ICollection<ForecastRequestItem> Items { get; set; } = new List<ForecastRequestItem>();
}