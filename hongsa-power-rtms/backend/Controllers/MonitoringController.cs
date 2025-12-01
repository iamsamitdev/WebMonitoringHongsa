using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;

namespace Hongsa.Rtms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonitorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MonitorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET Dashboard Stats (Cards)
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetStats()
        {
            var now = DateTime.Now;
            var timeNow = now.TimeOfDay;

            // 1. Get Latest Actual Load
            var actual = await _context.ActualMachineLoads
                .OrderByDescending(x => x.LogDateTime)
                .FirstOrDefaultAsync();

            decimal actualVal = actual?.ActualLoadMW ?? 0;

            // 2. Get Forecast Load for current time
            // ใช้ .Date เพื่อความชัวร์ในการเปรียบเทียบวันที่
            var forecast = await _context.ApprovedForecasts
                .Where(x => x.TargetDate.Date == now.Date && 
                            x.StartTime <= timeNow && 
                            x.EndTime > timeNow)
                .FirstOrDefaultAsync();

            decimal forecastVal = forecast?.FinalLoadMW ?? 0;

            // 3. Calculate % Diff
            decimal diffPercent = 0;
            if (forecastVal != 0)
            {
                // สูตรเดิม (Absolute Percentage Error):
                // diffPercent = Math.Abs((actualVal - forecastVal) / forecastVal) * 100;
                // สูตรใหม่ (Signed Percentage Error):
                diffPercent = (actualVal - forecastVal) / forecastVal * 100;
            }

            return Ok(new 
            { 
                actualMW = actualVal,       // แก้เป็นตัวเล็ก
                forecastMW = forecastVal,   // แก้เป็นตัวเล็ก
                diffPercent = Math.Round(diffPercent, 2),
                lastUpdate = actual?.LogDateTime
            });
        }

        // 2. GET Chart Data
        [HttpGet("chart-data")]
        public async Task<IActionResult> GetChartData([FromQuery] DateTime date)
        {
            // ดึง Forecast ทั้งวัน
            var forecasts = await _context.ApprovedForecasts
                .Where(x => x.TargetDate == date.Date)
                .OrderBy(x => x.StartTime)
                .ToListAsync();

            // ดึง Actual ทั้งวัน (อาจจะเยอะมาก ควร Group หรือ Filter)
            // ตัวอย่างนี้ดึงทุก 10 นาที เพื่อไม่ให้กราฟหนักเกินไป
            var actuals = await _context.ActualMachineLoads
                .Where(x => x.LogDateTime.Date == date.Date)
                .ToListAsync();

            // จัดรูปแบบข้อมูลสำหรับกราฟ (ขึ้นอยู่กับ Library หน้าบ้าน)
            // Expand Forecast Ranges to Hourly Points (00:00 - 23:00)
            var expandedForecasts = new List<object>();
            for (int h = 0; h < 24; h++)
            {
                var timePoint = new TimeSpan(h, 0, 0);
                // Find forecast that covers this hour
                var match = forecasts.FirstOrDefault(f => f.StartTime <= timePoint && f.EndTime > timePoint);
                if (match != null)
                {
                    expandedForecasts.Add(new { time = timePoint, mw = match.FinalLoadMW });
                }
            }

            // *Simplification: ส่ง Raw Data ให้ Front-end ไป map เอง หรือทำ logic mapping ที่นี่*
            // ส่งไป 2 arrays ให้ง่ายต่อการ plot
            return Ok(new { 
                forecasts = expandedForecasts, 
                actuals = actuals.Select(a => new { time = a.LogDateTime, mw = a.ActualLoadMW })   // แก้เป็นตัวเล็ก
            });
        }
    }
}