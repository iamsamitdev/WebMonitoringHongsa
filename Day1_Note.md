## Website Monitoring Real-time Machine Status - Day 1

### Download Trainging Document

[Click here to download the training document](https://bit.ly/webmonitor_hongsa)

### 📋 Content

1. [Overview](#overview)
2. [Installing Tools and Configurations](#installing-tools-and-configurations)
3. [Basics Web API with .NET 10](#basics-web-api-with-net-10)
4. [.NET with MSSQL Database](#net-with-mssql-database)
5. [Database with Entity Framework](#database-with-entity-framework)

### Overview
In this training, we will learn how to build a real-time website monitoring application using .NET 10, React.js, and SQL Server. The application will monitor the status of various websites and display real-time updates on a dashboard.

### Tools and Editors Required

1. Visual Studio Code
2. Node.js 22.x
3. Dotnet 10 SDK
4. SQL Server 2022 Express Edition
5. SQL Server Management Studio (SSMS)
6. Postman
7. Git

### Verify Tools and Environment on Windows / Mac OS / Linux

Open terminal or command prompt and run the following commands to verify the installations:

### Visual Studio Code
```bash
code --version
```

### Node JS
```bash
node -v
npm -v
npx -v
```

### Dotnet SDK
```bash
dotnet --version
dotnet --list-sdks
```

### SQL Server
```bash
sqlcmd -S . -E  -Q "SELECT @@VERSION"
```

### Git
```bash
git --version
git config --list
```

---

## Installing Tools and Configurations

### Visual Studio Code
- Download and install Visual Studio Code from [here](https://code.visualstudio.com/).
### Node.js
- Download and install Node.js from [here](https://nodejs.org/).
### .NET SDK
- Download and install .NET SDK from [here](https://dotnet.microsoft.com/en-us/download).
### SQL Server
- Download and install SQL Server from [here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads).
### SQL Server Management Studio (SSMS)
- Download and install SSMS from [here](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms).
### Postman
- Download and install Postman from [here](https://www.postman.com/downloads/).
### Git
- Download and install Git from [here](https://git-scm.com/downloads).

---

## Project Structure for Website Monitoring Application

```bash
hongsa-power-rtms
├── backend/
│   ├── appsettings.json               // เก็บ Config
│   ├── Program.cs                     // จุดเริ่มต้นของ Application
│   │
│   ├── Controllers/                   // (API Endpoints) รับ-ส่ง Request จาก React
│   │   ├── AuthController.cs          // Login (JWT)
│   │   ├── ForecastController.cs      // รับแผนการเดินเครื่อง, อนุมัติแผน
│   │   ├── DashboardController.cs     // ส่งข้อมูลกราฟ Real-time
│   │   └── SimulationController.cs    // (Optional) รับค่าจำลองจาก Simulator
│   │
│   ├── Models/                        // เก็บ Model ของข้อมูล
│   │   ├── AuthModel.cs               // Model สำหรับ Auth
│   │   ├── ForecastModel.cs           // Model สำหรับ Forecast
│   │   ├── DashboardModel.cs          // Model สำหรับ Dashboard
│   │   └── SimulationModel.cs         // (Optional) Model สำหรับ Simulation
│   │
│   ├── Services/                      // เก็บ Business Logic
│   │   ├── AuthService.cs             // Logic สำหรับ Auth
│   │   ├── ForecastService.cs         // Logic สำหรับ Forecast
│   │   ├── DashboardService.cs        // Logic สำหรับ Dashboard
│   │   └── SimulationService.cs       // (Optional) Logic สำหรับ Simulation
│   │
│   └── Data/                          // เก็บ Context สำหรับเชื่อมต่อ Database
│       ├── SeedData.cs                // ข้อมูลเริ่มต้น
│       └── ApplicationDbContext.cs    // DbContext สำหรับ Entity Framework
└── frontend/
    ├── public/                        // ไฟล์สาธารณะ เช่น index.html
    ├── src/                           // โค้ด React.js
    │   ├── components/                // เก็บ Component ต่างๆ
    │   ├── pages/                     // เก็บ Pages ต่างๆ
    │   ├── services/                  // เก็บ Service สำหรับเรียก API
    │   ├── App.js                     // จุดเริ่มต้นของ React Application
    │   └── index.js                   // ไฟล์หลักสำหรับเรนเดอร์ React
    └── package.json                   // เก็บ Dependencies และ Scripts ของ React
```

## Basics Web API with .NET 10

### Step 1: Verify .NET SDK Installation
Open terminal or command prompt and run:
```bash
dotnet --version
```

### Step 2: Create Directory for the Project
```bash
mkdir hongsa-power-rtms
cd hongsa-power-rtms
```

### Step 3: Create a New .NET Web API Project
```bash
# คำสั่งสร้างโปรเจค Web API ใหม่
dotnet new webapi --use-controllers -o backend -n Hongsa.Rtms.Api

# เปิดโปรเจคที่สร้างขึ้นใน Visual Studio Code
code backend -r

# หากพบปัญหาไม่สามารถ restore nuget packages ได้ ให้รันคำสั่งนี้
dotnet nuget add source "https://api.nuget.org/v3/index.json" -n "nuget.org"

# แล้วรันคำสั่งนี้อีกครั้ง
dotnet restore
```
อธิบายคำสั่ง:
- `dotnet new webapi`: สร้างโปรเจค Web API ใหม่
- `--use-controllers`: ใช้ Controllers แทน Minimal APIs
- `-o backend`: สร้างโฟลเดอร์ชื่อ backend สำหรับเก็บโปรเจค
- `-n Hongsa.Rtms.Api`: กำหนดชื่อโปรเจค

### Step 4: Set application url port
เปิดไฟล์ `Properties/launchSettings.json` และแก้ไขค่า `applicationUrl` เป็น:
```json
{
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "https://localhost:5001;http://localhost:5000",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

### Step 5: Run the Application
```bash
dotnet watch run
```

### Step 6: Test the API Endpoint
Open your web browser or Postman and navigate to:
```
http://localhost:5000/weatherforecast

You should see a JSON response with weather forecast data.
```

### Step 7: Edit the WeatherForecast Controller for Testing hot-reload
Open `Controllers/WeatherForecastController.cs` Edit `Enumerable.Range(1, 10)`
```csharp
    public IEnumerable<WeatherForecast> Get()
    {
        return Enumerable.Range(1, 10).Select(index => new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        })
        .ToArray();
    }
```

### Step 8: Save the file and see the changes in real-time
After saving the file, the application will automatically restart, and you can refresh your browser or Postman to see the updated response.

### Step 9: Stop the Application
Press `Ctrl + C` in the terminal to stop the application.

### Step 10: Add Scalar Package for API Documentation
```bash
dotnet add package Scalar.AspNetCore --version 2.11.0
```

### Step 11: Configure Scalar in Program.cs
เปิดไฟล์ `Program.cs` และเพิ่มโค้ดต่อไปนี้:
```csharp
using Scalar.AspNetCore;

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
```

### Step 12: Run the Application Again
```bash
dotnet watch run
```

### Step 13: Access Scalar API Documentation
Open your web browser and navigate to:
```
http://localhost:5000/scalar
```
---

### 💻 เรียนรู้การสร้าง REST API ด้วย .NET Web API แบบ Controller-base APIs

#### Step 1: 
ลบไฟล์ `Controller/WeatherForecastController.cs`
และไฟล์ `WeatherForecast.cs`

#### Step 2:
สร้าง model ใน `Models/User.cs`
```csharp
namespace Hongsa.Rtms.Api.Models;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Fullname { get; set; }
}
```

#### Step 3:
สร้าง controller ใน `Controllers/UserController.cs`
```csharp
using Microsoft.AspNetCore.Mvc;
using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // api/User
public class UserController : ControllerBase
{
    // mock data for users
    private static readonly List<User> _users = new List<User>
    {
        new User { 
            Id = 1, 
            Username = "john", 
            Email = "john@email.com", 
            Fullname = "John Doe"
        },
        new User { 
            Id = 2, 
            Username = "samit", 
            Email = "samit@email.com", 
            Fullname = "Samit Koyom"
        },
    };

    // GET: api/User
    [HttpGet]
    public ActionResult<IEnumerable<User>> GetUsers()
    {
        // IEnumerable คืออะไร
        // IEnumerable เป็น interface ใน .NET Framework ที่ใช้แทน collection ของ object
        // interface นี้กำหนด method เพียงตัวเดียวคือ GetEnumerator()
        // GetEnumerator() : method นี้ return enumerator
        // enumerator : object ที่ใช้วนซ้ำผ่าน collection
        // ในที่นี้เราใช้ IEnumerable ในการ return ข้อมูลของ users

        // วนซ้ำผ่าน collection โดยใช้ foreach
        // foreach (var user in _users)
        // {
        //     Console.WriteLine($"{user.Id} - {user.Username}");
        // }

        return Ok(_users);
    }

    // GET: api/User/{id}
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        var user = _users.Find(u => u.Id == id); // find user by id
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }


    // POST: api/User
    [HttpPost]
    public ActionResult<User> CreateUser([FromBody] User user)
    {
        _users.Add(user);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    // PUT: api/User/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] User user)
    {
        // Validate user id
        if (id != user.Id)
        {
            return BadRequest();
        }

        // Find existing user
        var existingUser = _users.Find(u => u.Id == id);
        if (existingUser == null)
        {
            return NotFound();
        }

        // Update user
        existingUser.Username = user.Username;
        existingUser.Email = user.Email;
        existingUser.Fullname = user.Fullname;

        // Return updated user
        return Ok(existingUser);
    }

    // DELETE: api/User/2
    [HttpDelete("{id}")]
    public ActionResult DeleteUser(int id)
    {
        // Find existing user
        var user = _users.Find(u => u.Id == id);

        if (user == null)
        {
            return NotFound();
        }

        // Remove user from list
        _users.Remove(user);
        return NoContent();
    }


}
```

#### Step 4:
รันแอปพลิเคชัน
```bash
dotnet watch run
```

#### Step 5:
ทดสอบ API Endpoints ด้วย Postman หรือ Web Browser
- GET all users: `http://localhost:5000/api/User`
- GET user by id: `http://localhost:5000/api/User/1`
- POST create new user: `http://localhost:5000/api/User`
  - Body (raw, JSON):
    ```json
    {
        "id": 3,
        "username": "alice",
        "email": "alice@email.com",
        "fullname": "Alice Wonderland"
    }
    ```
- PUT update user: `http://localhost:5000/api/User/3`
  - Body (raw, JSON):
    ```json
    {
        "id": 3,
        "username": "alice_updated",
        "email": "alice_updated@email.com",
        "fullname": "Alice Wonderland"
    }
    ```
- DELETE user: `http://localhost:5000/api/User/3`

---

## .NET with MSSQL Database
### Step 1: Install SQL Server
ดาวน์โหลดและติดตั้ง SQL Server 2022 Express Edition จาก [ที่นี่](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Step 2: Install SQL Server Management Studio (SSMS)
ดาวน์โหลดและติดตั้ง SSMS จาก [ที่นี่](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

### Step 3: Create a New Database
1. เปิด SSMS และเชื่อมต่อกับ SQL Server instance ของคุณ
2. คลิกขวาที่ "Databases" และเลือก "New Database..."
3. ตั้งชื่อฐานข้อมูล เช่น `HongsaRtmsDb` และคลิก "OK"

### Step 4: Configure Connection String in appsettings.json
เปิดไฟล์ `appsettings.json` ในโฟลเดอร์ `backend` และเพิ่ม connection string สำหรับเชื่อมต่อกับฐานข้อมูล SQL Server:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HongsaRtmsDb;User Id=your_username;Password=your_password;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```
> Authentication Method Options:
> - For SQL Server Authentication:
>  "DefaultConnection": "Server=localhost;Database=HongsaRtmsDb;User Id=sa;Password=your_password;"
> - For Windows Authentication:
>  "DefaultConnection": "Data Source=localhost\\SQLEXPRESS;Initial Catalog=HongsaRtmsDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"

### Step 5: Install Entity Framework Core Packages
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่มแพ็กเกจ Entity Framework Core สำหรับ SQL Server:
```bash
dotnet add package Microsoft.EntityFrameworkCore --version 10.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 10.0.0
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 10.0.0
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 10.0.0
```
อธิบาย package:
- `Microsoft.EntityFrameworkCore`: แพ็กเกจหลักของ Entity Framework Core
- `Microsoft.EntityFrameworkCore.Design`: แพ็กเกจสำหรับเครื่องมือการออกแบบ เช่น การสร้าง Migration
- `Microsoft.EntityFrameworkCore.SqlServer`: แพ็กเกจสำหรับการใช้งานกับ SQL Server
- `Microsoft.EntityFrameworkCore.Relational`: แพ็กเกจสำหรับการใช้งานกับฐานข้อมูลเชิงสัมพันธ์

### Step 6: Create ApplicationDbContext
สร้างโฟลเดอร์ `Data` ในโฟลเดอร์ `backend` และสร้างไฟล์ `ApplicationDbContext.cs` ภายในโฟลเดอร์ `Data`:
```csharp
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
```

#### Step 7: Configure DbContext in Program.cs
```csharp
using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options
            .WithTitle("Hongsa RTMS API (Scalar)")
            .WithTheme(ScalarTheme.Laserwave)
            .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
} 
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
```