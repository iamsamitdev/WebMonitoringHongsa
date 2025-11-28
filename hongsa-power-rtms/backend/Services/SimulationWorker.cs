using Hongsa.Rtms.Api.Data;
using Hongsa.Rtms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hongsa.Rtms.Api.Services
{
    public class SimulationWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<SimulationWorker> _logger;

        public SimulationWorker(IServiceProvider serviceProvider, ILogger<SimulationWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Simulation Worker Started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await DoWorkAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error in Simulation Worker");
                }

                // รอ 1 นาที (60,000 ms) ก่อนทำงานรอบถัดไป
                await Task.Delay(60000, stoppingToken);
            }
        }

        private async Task DoWorkAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var now = DateTime.Now;
                var timeNow = now.TimeOfDay;

                // 1. จำลองค่า Actual Load (Machine Running Always)
                // โจทย์: เครื่องจักร Run ตลอด และค่าไม่เกิน 120 MW
                var random = new Random();
                
                // สุ่มค่าพื้นฐานในช่วง 80 - 119 (เพื่อให้เป็นช่วง Run ที่สมจริง)
                decimal simulatedLoad = random.Next(80, 120); 
                
                // เพิ่มทศนิยมเพื่อให้ข้อมูลดูเป็นธรรมชาติ
                simulatedLoad += (decimal)random.NextDouble();

                // ตรวจสอบขั้นสุดท้าย: ห้ามเกิน 120.00 MW เด็ดขาด
                if (simulatedLoad > 120.00m) 
                {
                    simulatedLoad = 120.00m;
                }
                
                // ปัดเศษทศนิยม 2 ตำแหน่ง
                simulatedLoad = Math.Round(simulatedLoad, 2);

                // 2. บันทึก Actual Load ลง Database
                var log = new ActualMachineLoad
                {
                    LogDateTime = now,
                    ActualLoadMW = simulatedLoad
                };
                context.ActualMachineLoads.Add(log);

                // 3. ตรวจสอบ Alert Condition (ยังคง Logic เดิมไว้เพื่อแจ้งเตือนหาก Diff เกิน)
                // ดึงแผน (Forecast) มาเทียบ (ถ้ามี)
                var forecast = await context.ApprovedForecasts
                    .AsNoTracking()
                    .Where(x => x.TargetDate == now.Date &&
                                x.StartTime <= timeNow &&
                                x.EndTime > timeNow)
                    .FirstOrDefaultAsync();

                if (forecast != null && forecast.FinalLoadMW > 0)
                {
                    decimal diff = Math.Abs(simulatedLoad - forecast.FinalLoadMW);
                    decimal percent = (diff / forecast.FinalLoadMW) * 100;

                    // ดึง Config Threshold
                    var thresholdConfig = await context.NotificationConfigs
                        .FirstOrDefaultAsync(c => c.ConfigKey == "DiffThresholdPercent");
                    decimal limit = thresholdConfig?.ConfigValue ?? 30;

                    if (percent >= limit)
                    {
                        var alert = new AlertLog
                        {
                            AlertDateTime = now,
                            AlertType = "Warning",
                            Message = $"Actual ({simulatedLoad:F2}) vs Forecast ({forecast.FinalLoadMW:F2}) Diff {percent:F2}%",
                            ActualMW = simulatedLoad,
                            ForecastMW = forecast.FinalLoadMW,
                            DiffPercent = percent,
                            Recipient = "Admin Group"
                        };
                        context.AlertLogs.Add(alert);
                        
                        _logger.LogWarning($"[ALERT] Load Diff {percent:F2}% Detected!");
                    }
                }

                await context.SaveChangesAsync();
                _logger.LogInformation($"[SIMULATION] Logged Actual: {simulatedLoad} MW at {now}");
            }
        }
    }
}