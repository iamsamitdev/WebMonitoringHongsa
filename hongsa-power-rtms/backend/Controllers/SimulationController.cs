using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;
using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimulationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SimulationController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class SimInputDto
        {
            public decimal ActualLoadMW { get; set; }
        }

        [HttpPost("input")]
        public async Task<IActionResult> InputActual([FromBody] SimInputDto input)
        {
            var now = DateTime.Now;

            // 1. Save Actual Load
            var log = new ActualMachineLoad
            {
                LogDateTime = now,
                ActualLoadMW = input.ActualLoadMW
            };
            _context.ActualMachineLoads.Add(log);

            // 2. Logic: Check Diff
            var timeNow = now.TimeOfDay;
            var forecast = await _context.ApprovedForecasts
                 .Where(x => x.TargetDate == now.Date &&
                             x.StartTime <= timeNow &&
                             x.EndTime > timeNow)
                 .FirstOrDefaultAsync();

            if (forecast != null)
            {
                decimal diff = Math.Abs(input.ActualLoadMW - forecast.FinalLoadMW);
                decimal percent = (forecast.FinalLoadMW == 0) ? 0 : (diff / forecast.FinalLoadMW) * 100;

                // ดึง Config Threshold (30%)
                var thresholdConfig = await _context.NotificationConfigs
                    .FirstOrDefaultAsync(c => c.ConfigKey == "DiffThresholdPercent");
                decimal limit = thresholdConfig?.ConfigValue ?? 30;

                if (percent >= limit)
                {
                    // Trigger Alert Log
                    var alert = new AlertLog
                    {
                        AlertDateTime = now,
                        AlertType = "Warning",
                        Message = $"Actual Load ({input.ActualLoadMW}) differs from Forecast ({forecast.FinalLoadMW}) by {percent:F2}%",
                        ActualMW = input.ActualLoadMW,
                        ForecastMW = forecast.FinalLoadMW,
                        DiffPercent = percent,
                    };
                    _context.AlertLogs.Add(alert);
                    
                    // TODO: Call Line Notify API / Send Email here
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Data logged" });
        }
    }
}