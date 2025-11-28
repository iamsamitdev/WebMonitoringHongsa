using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;
using System.Text;

namespace Hongsa.Rtms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("export")]
        public async Task<IActionResult> ExportReport(int month, int year)
        {
            // ดึงข้อมูล Approved ของเดือนนั้น
            var data = await _context.ApprovedForecasts
                .Where(x => x.TargetDate.Month == month && x.TargetDate.Year == year)
                .OrderBy(x => x.TargetDate).ThenBy(x => x.StartTime)
                .ToListAsync();

            // สร้าง CSV แบบง่าย (หรือใช้ Library เช่น CsvHelper / EPPlus สำหรับ Excel)
            var csv = new StringBuilder();
            csv.AppendLine("Date,Start Time,End Time,Forecast Load (MW)");

            foreach (var item in data)
            {
                csv.AppendLine($"{item.TargetDate:yyyy-MM-dd},{item.StartTime},{item.EndTime},{item.FinalLoadMW}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            var result = new FileContentResult(bytes, "text/csv")
            {
                FileDownloadName = $"Report_{year}_{month}.csv"
            };

            return result;
        }
    }
}