using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Hongsa.Rtms.Api.Models;
using Hongsa.Rtms.Api.Services;

using Scalar.AspNetCore;
var builder = WebApplication.CreateBuilder(args);


// Entity Framework Core MS SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Adding Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // ไม่บังคับว่าต้องมีตัวเลข (0-9)
    options.Password.RequireDigit = false;
    // ไม่บังคับว่าต้องมีตัวพิมพ์เล็ก (a-z)
    options.Password.RequireLowercase = false;
    // ไม่บังคับว่าต้องมีตัวพิมพ์ใหญ่ (A-Z)
    options.Password.RequireUppercase = false;
    // ไม่บังคับว่าต้องมีอักขระพิเศษ (เช่น ! @ # $ %)
    options.Password.RequireNonAlphanumeric = false;
    // กำหนดความยาวขั้นต่ำ (เช่น ตั้งเป็น 8 ตัวอักษร)
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
// Adding Jwt Bearer
.AddJwtBearer(options  => {
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration.GetSection("JWT:ValidAudience").Value!,
        ValidIssuer = builder.Configuration.GetSection("JWT:ValidIssuer").Value!,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT:Secret").Value!))
    };
});

// Allow CORS
builder.Services.AddCors(options => 
{
 options.AddPolicy("MultipleOrigins",
    policy =>
    {
        policy.WithOrigins(
            "*" // Allow any origin
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Register Simulation Worker (Background Service)
builder.Services.AddHostedService<SimulationWorker>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    // Scalar API Reference Configuration
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("Hongsa RTMS API (Scalar)")
            .WithTheme(ScalarTheme.Laserwave) // light, dark, purple
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}
// ปิดการใช้งาน HTTPS ชั่วคราว (ถ้าจำเป็น)
// app.UseHttpsRedirection();

// Add Authentication
app.UseAuthentication();

// Add Authorization
app.UseAuthorization();

// Enable CORS
app.UseCors("MultipleOrigins");

app.MapControllers();

app.Run();
