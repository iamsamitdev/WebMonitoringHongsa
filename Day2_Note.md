## Website Monitoring Real-time Machine Status - Day 2

### 📋 Content

1. [.NET with MSSQL Database](#net-with-mssql-database)
2. [Database with Entity Framework](#database-with-entity-framework)
3. [.NET 10 Rest API CRUD with EFCore](#net-10-rest-api-crud-with-efcore)
4. [.NET 10 JWT and Scalar](#net-10-jwt-and-scalar)
5. [React Frontend Setup](#react-frontend-setup)
6. [API Integration](#api-integration)

## .NET with MSSQL Database
### Step 1: Install SQL Server
ดาวน์โหลดและติดตั้ง SQL Server 2022 Express Edition จาก [ที่นี่](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)

### Step 2: Install SQL Server Management Studio (SSMS)
ดาวน์โหลดและติดตั้ง SSMS จาก [ที่นี่](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

### Step 3: Create a New Database
1. เปิด SSMS และเชื่อมต่อกับ SQL Server instance ของคุณ
2. คลิกขวาที่ "Databases" และเลือก "New Database..."
3. ตั้งชื่อฐานข้อมูล เช่น `HongsaRtmsDb` และคลิก "OK"

### Step 4: Create Table "Category" and "Product"
รันคำสั่ง SQL ต่อไปนี้ใน SSMS เพื่อสร้างตาราง `Category` และ `Product`:

คำสั่งสร้างตาราง `Category`:
```sql
USE [HongsaRtmsDb]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Category](
	[CategoryID] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [varchar](64) NULL,
	[CategoryStatus] [int] NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
```

คำสั่งสร้างตาราง `Product`:
```sql
USE [HongsaRtmsDb]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Product](
	[ProductID] [int] IDENTITY(1,1) NOT NULL,
	[ProductName] [varchar](128) NULL,
	[UnitPrice] [decimal](18, 2) NULL,
	[UnitInStock] [int] NULL,
	[ProductPicture] [varchar](256) NULL,
	[CategoryID] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[ModifiedDate] [datetime] NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[ProductID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
```

### Step 5: เพิ่มข้อมูลตัวอย่างในตาราง Category และ Product
รันคำสั่ง SQL ต่อไปนี้ใน SSMS เพื่อเพิ่มข้อมูลตัวอย่างในตาราง `Category` และ `Product`:
คำสั่งเพิ่มข้อมูลตัวอย่างในตาราง `Category`:
```sql
USE [HongsaRtmsDb]
GO

INSERT INTO [dbo].[Category] ([CategoryName], [CategoryStatus]) VALUES
('Mobile', 1),
('Tablet', 1),
('Smart Watch', 1),
('Labtop', 1);
```

คำสั่งเพิ่มข้อมูลตัวอย่างในตาราง `Product`:
```sql

USE [HongsaRtmsDb]
GO

INSERT INTO [dbo].[Product] ([CategoryID], [ProductName], [UnitPrice], [ProductPicture], [UnitInStock], [CreatedDate], [ModifiedDate]) VALUES
(1, 'iPhone 13 Pro Max', 55000, 'https://www.mxphone.com/wp-content/uploads/2021/04/41117-79579-210401-iPhone12ProMax-xl-1200x675.jpg', 3, '2021-11-22T00:00:00', '2021-11-22T00:00:00'),
(2, 'iPad Pro 2021', 18500, 'https://cdn.siamphone.com/spec/apple/images/ipad_pro_12.9%E2%80%91inch/com_1.jpg', 10, '2021-11-20T00:00:00', '2021-11-20T00:00:00'),
(3, 'Airpods Pro', 12500, 'https://support.apple.com/library/content/dam/edam/applecare/images/en_US/airpods/airpods-pro-2gen-front-case.png', 5, '2021-11-10T10:30:00', '2021-11-12T10:30:00'),
(4, 'Macbook Pro M1', 45000, 'https://cdn.mos.cms.futurecdn.net/iYCQTPgBSdDmkYESfPkunh.jpg', 10, '2021-11-15T10:30:00', '2021-11-15T10:30:00');
```

### Step 6: Install Entity Framework Core Packages
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

### Step 7: ติดตั้งชุดคำสั่ง dotnet-ef cli
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่มเครื่องมือ `dotnet-ef` CLI:
```bash
ตรวจเช็คว่ามีการติดตั้ง ไว้หรือยัง
dotnet ef --version

หากยังไม่พบให้ทำการติดตั้งก่อน
dotnet tool install --global dotnet-ef

อัพเดทเวอร์ชันล่าสุด
dotnet tool update --global dotnet-ef
```

### Step 8: การสร้าง Scaffold-DbContext (Reverse engineer)
รันคำสั่งต่อไปนี้ใน terminal เพื่อสร้าง DbContext และ Entity classes จากฐานข้อมูลที่มีอยู่:

**Windows Authentication**:
PowerShell:
```powershell
dotnet ef dbcontext scaffold "Server=YOUR_SERVER_NAME;Database=HongsaRtmsDbClass;TrustServerCertificate=True;Trusted_Connection=True;" `
Microsoft.EntityFrameworkCore.SqlServer `
--output-dir Models `
--context ApplicationDbContext `
--use-database-names `
--no-onconfiguring `
--no-pluralize `
--force
```
> MSSQL รุ่น EXPRESS อาจต้องระบุชื่อ instance ด้วย เช่น `Server=localhost\SQLEXPRESS;`

Command Prompt:
```bash
dotnet ef dbcontext scaffold ^"Server=YOUR_SERVER_NAME;^
Database=HongsaRtmsDb;^
TrustServerCertificate=True;^
Trusted_Connection=True;^" ^
Microsoft.EntityFrameworkCore.SqlServer ^
--output-dir Models ^
--context ApplicationDbContext ^
--use-database-names ^
--no-onconfiguring ^
--no-pluralize ^
--force
```
> MSSQL รุ่น EXPRESS อาจต้องระบุชื่อ instance ด้วย เช่น `Server=localhost\SQLEXPRESS;`

**SQL Server Authentication**:
PowerShell:
```powershell
dotnet ef dbcontext scaffold "Server=YOUR_SERVER_NAME;Initial Catalog=HongsaRtmsDb;Persist Security Info=False;User ID=sa;Password=YOUR_PASSWORD;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=True;Connection Timeout=30;" `
Microsoft.EntityFrameworkCore.SqlServer `
--output-dir "Models" `
--context ApplicationDbContext `
--use-database-names `
--no-onconfiguring `
--no-pluralize `
--force
```
> เปลี่ยน `YOUR_SERVER_NAME` และ `YOUR_PASSWORD` ให้ตรงกับการตั้งค่าของคุณ

Command Prompt:
```bash
dotnet ef dbcontext scaffold ^"Server=YOUR_SERVER_NAME;^
Initial Catalog=HongsaRtmsDb;^
Persist Security Info=False;^
User ID=sa;^
Password=YOUR_PASSWORD;^
MultipleActiveResultSets=True;^
Encrypt=True;^
TrustServerCertificate=True;^
Connection Timeout=30;^" ^
Microsoft.EntityFrameworkCore.SqlServer ^
--output-dir "Models" ^
--context ApplicationDbContext ^
--use-database-names ^
--no-onconfiguring ^
--no-pluralize ^
--force
```
> เปลี่ยน `YOUR_SERVER_NAME` และ `YOUR_PASSWORD` ให้ตรงกับการตั้งค่าของคุณ


### Step 9: ย้ายไฟล์ ApplicationDbContext ไปไว้ยัง Data/ApplicationDbContext.cs
ย้ายไฟล์ `ApplicationDbContext.cs` ที่ถูกสร้างขึ้นมาไปไว้ยังโฟลเดอร์ `Data` ภายในโฟลเดอร์ `backend`

แก้ไข namespace ของ `ApplicationDbContext.cs` ให้ตรงกับโครงสร้างโปรเจค และเพิ่มการอ้างอิงโมเดล:
```csharp
using Hongsa.Rtms.Api.Models;
namespace Hongsa.Rtms.Api.Data;
```

### Step 10: กำหนด Connection String สำหรับเชื่อมต่อฐานข้อมูล ที่ไฟล์ appsettings.json
เปิดไฟล์ `appsettings.json` ในโฟลเดอร์ `backend` และเพิ่ม connection string สำหรับเชื่อมต่อกับฐานข้อมูล SQL Server:

Windows Authentication:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=HongsaRtmsDb;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"
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
> เปลี่ยน `YOUR_SERVER_NAME` ให้ตรงกับการตั้งค่าของคุณ
> MSSQL รุ่น EXPRESS อาจต้องระบุชื่อ instance ด้วย เช่น `Server=localhost\SQLEXPRESS;`

SQL Server Authentication:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=YOUR_SERVER_NAME;Initial Catalog=HongsaRtmsDb;User Id=sa;Password=YOUR_PASSWORD;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"
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
> เปลี่ยน `YOUR_SERVER_NAME` และ `YOUR_PASSWORD` ให้ตรงกับการตั้งค่าของคุณ
> MSSQL รุ่น EXPRESS อาจต้องระบุชื่อ instance ด้วย เช่น `Server=localhost\SQLEXPRESS;`

### Step 11: เพิ่มบริการ DbContext ใน Program.cs
เปิดไฟล์ `Program.cs` ในโฟลเดอร์ `backend` และเพิ่มบริการ DbContext ในตัวจัดการการพึ่งพา (Dependency Injection) ดังนี้:
```csharp
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Data;

// Entity Framework Core MS SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ปิดการใช้งาน HTTPS ชั่วคราว (ถ้าจำเป็น)
// app.UseHttpsRedirection();
```

### Step 12: ทดสอบการเชื่อมต่อฐานข้อมูล
สร้าง Controller `ProductController.cs` ใหม่เพื่อทดสอบการเชื่อมต่อฐานข้อมูลและดึงข้อมูลจากตาราง `Product`:
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hongsa.Rtms.Api.Models;
using Hongsa.Rtms.Api.Data;

namespace Hongsa.Rtms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    // สร้าง Object ของ ApplicationDbContext
    private readonly ApplicationDbContext _context;

    // สร้าง Constructor รับค่า ApplicationDbContext
    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ทดสอบเขียนฟังก์ชันการเชื่อมต่อ database
    // GET: /api/Product/testconnectdb
    [HttpGet("testconnectdb")]
    public IActionResult TestConnection()
    {
        try
        {
            _context.Database.OpenConnection();
            _context.Database.CloseConnection();
            return Ok("Connected");
        }
        catch (Exception ex)
        {
            return BadRequest($"Not Connected: {ex.Message}");
        }
    }
}
```

### Step 13: รันโปรเจคและทดสอบ API
รันคำสั่งต่อไปนี้ใน terminal เพื่อเริ่มต้นโปรเจค:
```bash
dotnet watch run
```

เปิดเบราว์เซอร์และไปที่ URL: `http://localhost:5000/api/Product/testconnectdb` (หรือพอร์ตที่โปรเจคของคุณรันอยู่) หากการเชื่อมต่อสำเร็จ คุณจะเห็นข้อความ "Connected" ปรากฏขึ้น

### Step 14: เพิ่มฟังก์ชัน CRUD สำหรับ Product
เพิ่มฟังก์ชัน CRUD สำหรับจัดการข้อมูลสินค้าใน `ProductController.cs`:
```csharp
// ฟังก์ชันสำหรับการดึงข้อมูลสินค้าทั้งหมด
// GET: /api/Product
[HttpGet]
public ActionResult<Product> GetProducts()
{
    // LINQ สำหรับการดึงข้อมูลจากตาราง Products ทั้งหมด
    // var products = _context.Product.ToList();

    // แบบอ่านที่มีเงื่อนไข
    // var products = _context.Product.Where(p => p.UnitPrice > 45000).ToList();

    // แบบเชื่อมกับตารางอื่น products เชื่อมกับ categories
    var products = _context.Product
        .Join(
            _context.Category,
            p => p.CategoryID,
            c => c.CategoryID,
            (p, c) => new
            {
                p.ProductID,
                c.CategoryName,
                p.ProductName,
                p.UnitPrice,
                p.UnitInStock,
                p.ProductPicture,
                p.CreatedDate
            }
        ).ToList();

    // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
    return Ok(products);
}

// ฟังก์ชันสำหรับการดึงข้อมูลสินค้าตาม id
// GET: /api/Product/{id}
[HttpGet("{id}")]
public ActionResult<Product> GetProduct(int id)
{
    // LINQ สำหรับการดึงข้อมูลจากตาราง Products ตาม id
    var product = _context.Product.FirstOrDefault(p => p.ProductID == id);

    // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
    if (product == null)
    {
        return NotFound();
    }

    // ส่งข้อมูลกลับไปให้ผู้ใช้งาน
    return Ok(product);
}

// ฟังก์ชันสำหรับการเพิ่มข้อมูลสินค้า
// POST: /api/Product
[HttpPost]
public ActionResult<Product> CreateProduct(Product product)
{
    // เพิ่มข้อมูลลงในตาราง Products
    _context.Product.Add(product);
    _context.SaveChanges();

    // ส่งข้อมูลกลับไปให้ผู้ใช้
    return Ok(product);
}

// ฟังก์ชันสำหรับการแก้ไขข้อมูลสินค้า
// PUT: /api/Product/{id}
[HttpPut("{id}")]
public ActionResult<Product> UpdateProduct(int id, Product product)
{
    // ดึงข้อมูลสินค้าตาม id
    var existingProduct = _context.Product.FirstOrDefault(p => p.ProductID == id);

    // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
    if (existingProduct == null)
    {
        return NotFound();
    }

    // แก้ไขข้อมูลสินค้า
    existingProduct.ProductName = product.ProductName;
    existingProduct.UnitPrice = product.UnitPrice;
    existingProduct.UnitInStock = product.UnitInStock;
    existingProduct.CategoryID = product.CategoryID;

    // บันทึกข้อมูล
    _context.SaveChanges();

    // ส่งข้อมูลกลับไปให้ผู้ใช้
    return Ok(existingProduct);
}

// ฟังก์ชันสำหรับการลบข้อมูลสินค้า
// DELETE: /api/Product/{id}
[HttpDelete("{id}")]
public ActionResult<Product> DeleteProduct(int id)
{
    // ดึงข้อมูลสินค้าตาม id
    var product = _context.Product.FirstOrDefault(p => p.ProductID == id);

    // ถ้าไม่พบข้อมูลจะแสดงข้อความ Not Found
    if (product == null)
    {
        return NotFound();
    }

    // ลบข้อมูล
    _context.Product.Remove(product);
    _context.SaveChanges();

    // ส่งข้อมูลกลับไปให้ผู้ใช้
    return Ok(product);
}
```
## .NET 10 JWT and Scalar

### Step 15: ติดตั้งแพ็กเกจสำหรับ JWT
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่มแพ็กเกจสำหรับการใช้งาน JWT:
```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 10.0.0
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 10.0.0
```
อธิบาย package:
- `Microsoft.AspNetCore.Authentication.JwtBearer`: แพ็กเกจสำหรับการใช้งาน JWT Bearer Authentication
- `Microsoft.EntityFrameworkCore.Tools`: แพ็กเกจสำหรับเครื่องมือ Entity Framework Core
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore`: แพ็กเกจสำหรับการใช้งาน ASP.NET Core Identity กับ Entity Framework Core

### Step 16: เพิ่ม JWT ที่ไฟล์ appsettings.json
เปิดไฟล์ `appsettings.json` ในโฟลเดอร์ `backend` และเพิ่มการตั้งค่า JWT ดังนี้:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=YOUR_SERVER_NAME;Initial Catalog=HongsaRtmsDb;User Id=sa;Password=YOUR_PASSWORD;Integrated Security=True;Connect Timeout=30;Encrypt=True;TrustServerCertificate=True;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"
  },
  "JWT": {  
    "ValidAudience": "*",  
    "ValidIssuer": "*",  
    "Secret": "ByYM000OLlMQG6VVVp1OH7Xzyr7gHuw1qvUC5dcGt3SNM"  
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

### Step 17: เพิ่ม Config ของ JWT ในไฟล์ Program.cs
เปิดไฟล์ `Program.cs` ในโฟลเดอร์ `backend` และเพิ่มการตั้งค่า JWT ดังนี้:
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Adding Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
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

// Add Authentication
app.UseAuthentication();

// Add Authorization
app.UseAuthorization();
```

### Step 18: แก้ไขไฟล์ Data/ApplicationDbContext.cs
เปิดไฟล์ `ApplicationDbContext.cs` ในโฟลเดอร์ `Data` และแก้ไขให้สืบทอดมาจาก `IdentityDbContext` ดังนี้:
```csharp
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Hongsa.Rtms.Api.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // เรียกใช้ OnModelCreating ของคลาสแม่ IdentityDbContext
        base.OnModelCreating(modelBuilder);
    }
}
```

### Step 19: เพิ่มไฟล์ Migration สำหรับ Auth
รันคำสั่งต่อไปนี้ใน terminal เพื่อสร้างไฟล์ Migration สำหรับ ASP.NET Core Identity:
```bash
dotnet ef migrations add auth --context ApplicationDbContext
```

### Step 20: แก้ไขไฟล์ Migration ไม่ต้องให้สร้างตารางที่มีอยู่แล้ว
เปิดไฟล์ Migration ที่ถูกสร้างขึ้นมาใหม่ในโฟลเดอร์ `Migrations` เช่น `20251125005503_auth.cs`และลบโค้ดที่เกี่ยวข้องกับการสร้างตาราง `Category` และ `Product` ออก เช่น:
```csharp
/*
    migrationBuilder.CreateTable(
        name: "Category",
        columns: table => new
        {
            CategoryID = table.Column<int>(type: "int", nullable: false)
                .Annotation("SqlServer:Identity", "1, 1"),
            CategoryName = table.Column<string>(type: "varchar(64)", unicode: false, maxLength: 64, nullable: true),
            CategoryStatus = table.Column<int>(type: "int", nullable: true)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Category", x => x.CategoryID);
        });

    migrationBuilder.CreateTable(
        name: "Product",
        columns: table => new
        {
            ProductID = table.Column<int>(type: "int", nullable: false)
                .Annotation("SqlServer:Identity", "1, 1"),
            ProductName = table.Column<string>(type: "varchar(128)", unicode: false, maxLength: 128, nullable: true),
            UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
            UnitInStock = table.Column<int>(type: "int", nullable: true),
            ProductPicture = table.Column<string>(type: "varchar(256)", unicode: false, maxLength: 256, nullable: true),
            CategoryID = table.Column<int>(type: "int", nullable: true),
            CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true),
            ModifiedDate = table.Column<DateTime>(type: "datetime", nullable: true)
        },
        constraints: table =>
        {
            table.PrimaryKey("PK_Product", x => x.ProductID);
        });
    */
```


### Step 21: ทำการ Migrate ตัว Migration ให้เป็นฐานข้อมูล
รันคำสั่งต่อไปนี้ใน terminal เพื่อทำการ Migrate ตัว Migration ที่สร้างขึ้นให้เป็นฐานข้อมูล:
```bash
dotnet ef database update --context ApplicationDbContext
```

### Step 22: สร้าง Model RegisterModel.cs

สร้างไฟล์ `RegisterModel.cs` ในโฟลเดอร์ `Models` และเพิ่มโค้ดต่อไปนี้:
```csharp
using System.ComponentModel.DataAnnotations;

namespace Hongsa.Rtms.Api.Models;

public class RegisterModel
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, ErrorMessage = "Username is too long")]
    [MinLength(3, ErrorMessage = "Username is too short")]
    public required string Username { get; set; }
    
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is not valid")]
    public required string Email { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    public required string Password { get; set; }
}
```

### Step 23: สร้าง Model LoginModel.cs
สร้างไฟล์ `LoginModel.cs` ในโฟลเดอร์ `Models` และเพิ่มโค้ดต่อไปนี้:
```csharp
using System.ComponentModel.DataAnnotations;

namespace Hongsa.Rtms.Api.Models;

public class LoginModel
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, ErrorMessage = "Username is too long")]
    [MinLength(3, ErrorMessage = "Username is too short")]
    public string? Username { get; set; }
    
    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }
}
```

### Step 24: สร้าง Model UserRoles.cs
สร้างไฟล์ `UserRoles.cs` ในโฟลเดอร์ `Models` และเพิ่มโค้ดต่อไปนี้:
```csharp
namespace Hongsa.Rtms.Api.Models;

public class UserRolesModel
{
    public const string Admin = "Admin";
    public const string User = "User";
}
```

### Step 25: สร้างไฟล์ ResponseModel.cs ไว้สำหรับแสดงผลลัพธ์จาก API

สร้างไฟล์ `ResponseModel.cs` ในโฟลเดอร์ `Models` และเพิ่มโค้ดต่อไปนี้:
```csharp
namespace Hongsa.Rtms.Api.Models;

public class ResponseModel
{
    public string? Status { get; set; }
    public string? Message { get; set; }
}
```

### Step 26: สร้าง Controller ชื่อ AuthenticateController.cs
สร้างไฟล์ `AuthenticateController.cs` ในโฟลเดอร์ `Controllers` และเพิ่มโค้ดต่อไปนี้:
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticateController: ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    // Constructor
    public AuthenticateController(
        UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, 
        IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    // Register for User
    // Post api/authenticate/register-user
    [HttpPost]
    [Route("register-user")]
    public async Task<ActionResult> RegisterUser([FromBody] RegisterModel model)
    {
        // เช็คว่า username ซ้ำหรือไม่
        var userExists = await _userManager.FindByNameAsync(model.Username);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User already exists!"
                }
            );
        }

        // เช็คว่า email ซ้ำหรือไม่
        userExists = await _userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "Email already exists!"
                }
            );
        }

        // สร้าง User
        IdentityUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username
        };

        // สร้าง User ในระบบ
        var result = await _userManager.CreateAsync(user, model.Password);

        // ถ้าสร้างไม่สำเร็จ
        if(!result.Succeeded)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User creation failed! Please check user details and try again."
                }
            );
        }

        // กำหนด Roles Admin, User
        if (!await _roleManager.RoleExistsAsync(UserRolesModel.Admin))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.Admin));
        }

        if (await _roleManager.RoleExistsAsync(UserRolesModel.User))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.User));
            await _userManager.AddToRoleAsync(user, UserRolesModel.User);
        }

        return Ok(new ResponseModel
        {
            Status = "Success",
            Message = "User registered successfully"
        });
    }
    
    // Register for Admin
    // Post api/authenticate/register-admin
    [HttpPost]
    [Route("register-admin")]
    public async Task<ActionResult> RegisterAdmin([FromBody] RegisterModel model)
    {
        // เช็คว่า username ซ้ำหรือไม่
        var userExists = await _userManager.FindByNameAsync(model.Username);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User already exists!"
                }
            );
        }

        // เช็คว่า email ซ้ำหรือไม่
        userExists = await _userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "Email already exists!"
                }
            );
        }

        // สร้าง User
        IdentityUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username
        };

        // สร้าง User ในระบบ
        var result = await _userManager.CreateAsync(user, model.Password);

        // ถ้าสร้างไม่สำเร็จ
        if(!result.Succeeded)
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new ResponseModel
                {
                    Status = "Error",
                    Message = "User creation failed! Please check user details and try again."
                }
            );
        }

        // กำหนด Roles Admin, User
        if (await _roleManager.RoleExistsAsync(UserRolesModel.Admin)){
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.Admin));
            await _userManager.AddToRoleAsync(user, UserRolesModel.Admin);
        }

        if (!await _roleManager.RoleExistsAsync(UserRolesModel.User)){
            await _roleManager.CreateAsync(new IdentityRole(UserRolesModel.User));
        }

        return Ok(new ResponseModel
        {
            Status = "Success",
            Message = "User registered successfully"
        });
    }

    // Login for User
    // Post api/authenticate/login-user
    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginModel model)
    {

        var user = await _userManager.FindByNameAsync(model.Username!);

        // ถ้า login สำเร็จ
        if(user != null && await _userManager.CheckPasswordAsync(user, model.Password!))
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GetToken(authClaims);

            return Ok(new 
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }

        // ถ้า login ไม่สำเร็จ
        return Unauthorized();
    }

    // ฟังก์ชันสร้าง Token
    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));

        var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); // Windows time zone ID

        // Get the current time in Bangkok time zone
        var currentTime = TimeZoneInfo.ConvertTime(DateTime.UtcNow, timeZoneInfo);

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: currentTime.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }
}
```

### Step 27: กำหนด Authorization ใน ProductController.cs
เปิดไฟล์ `ProductController.cs` ในโฟลเดอร์ `Controllers` และเพิ่ม Attribute `[Authorize]` เพื่อกำหนดสิทธิ์การเข้าถึงดังนี้:
```csharp
using Microsoft.AspNetCore.Authorization;

[Authorize] // กำหนดว่า API นี้ต้องมีการ Login ก่อนเข้าถึง
[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    ...
}
```
### Step 28: ทดสอบการทำงานของ JWT
รันคำสั่งต่อไปนี้ใน terminal เพื่อเริ่มต้นโปรเจค:
```bash
dotnet watch run
```
เปิดโปรแกรม Postman หรือโปรแกรมสำหรับทดสอบ API อื่น ๆ และทำการทดสอบดังนี้:
1. ทดสอบการลงทะเบียนผู้ใช้ (Register)
   - Method: POST
   - URL: `http://localhost:5000/api/Authenticate/register-user`
   - Body (raw, JSON):
   ```json
   {
       "username": "testuser",
       "email": "testuser@example.com",
       "password": "Test@123"
   }
    ```
2. ทดสอบการเข้าสู่ระบบ (Login)
   - Method: POST
   - URL: `http://localhost:5000/api/Authenticate/login`
   - Body (raw, JSON):
   ```json
   {
       "username": "testuser",
       "password": "Test@123"
   }
   ```
3. คัดลอก Token ที่ได้รับจากการ Login
4. ทดสอบการเข้าถึง API ที่ต้องการ Authorization (เช่น ดึงข้อมูลสินค้า)
   - Method: GET
   - URL: `http://localhost:5000/api/Product`
   - Headers:
     - Key: Authorization
     - Value: Bearer YOUR_JWT_TOKEN
    - เปลี่ยน `YOUR_JWT_TOKEN` เป็น Token ที่คัดลอกมา
ถ้าการเข้าถึงสำเร็จ คุณจะได้รับข้อมูลสินค้ากลับมา

## React Frontend Setup

### Step 29: สร้างโปรเจค React ด้วย Vite
รันคำสั่งต่อไปนี้ใน terminal เพื่อสร้างโปรเจค React ใหม่ด้วย Vite:
```bash
cd ..
npm create vite@latest frontend -- --template react
```

### Step 30: ทดสอบรันโปรเจค React
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
cd frontend
npm install
npm run dev
```

### Step 31: ติดตั้งแพ็กเกจ Axios
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่มแพ็กเกจ Axios สำหรับการทำ HTTP requests:
```bash
cd frontend
npm install axios
```