# Hongsa Power RTMS API

This is the backend API for the **Hongsa Power Real-Time Monitoring System (RTMS)**. It provides services for user authentication, real-time monitoring, forecasting, simulation, and reporting.

## 🚀 Technologies

- **Framework:** .NET 10.0 (Web API)
- **Database:** SQL Server
- **ORM:** Entity Framework Core 10.0
- **Authentication:** ASP.NET Core Identity + JWT Bearer
- **API Documentation:** OpenAPI + Scalar
- **Background Services:** Hosted Services for Simulation

## 📂 Project Structure

```
backend/
├── Controllers/          # API Endpoints
│   ├── AuthenticateController.cs  # Login/Register
│   ├── MonitoringController.cs    # Real-time data
│   ├── ForecastController.cs      # Forecast logic
│   ├── SimulationController.cs    # Simulation inputs
│   ├── ReportController.cs        # Export reports
│   └── UserController.cs          # User management
├── Data/                 # Database Context (EF Core)
├── DTOs/                 # Data Transfer Objects
├── Models/               # Database Entities
├── Services/             # Business Logic & Background Workers
│   └── SimulationWorker.cs        # Background simulation task
└── appsettings.json      # Configuration (DB, JWT)
```

## 🛠️ Setup & Installation

### Prerequisites
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or Standard)

### 1. Clone the repository
```bash
git clone <repository-url>
cd hongsa-power-rtms/backend
```

### 2. Configure Database & JWT
Update `appsettings.json` with your SQL Server connection string and JWT secret.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=HongsaRtmsDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JWT": {
    "ValidAudience": "*",
    "ValidIssuer": "*",
    "Secret": "YOUR_SUPER_SECRET_KEY_MUST_BE_LONG_ENOUGH"
  }
}
```

### 3. Run Migrations
Apply the database migrations to create the schema.

```bash
dotnet ef database update
```

### 4. Run the Application
```bash
dotnet watch run
```
The API will start (usually on `http://localhost:5000` or `https://localhost:5001`).

## 📚 API Documentation

This project uses **Scalar** for API documentation.
Once the application is running, visit:

```
http://localhost:<port>/scalar/v1
```

## 🔑 Key Features

- **Authentication:** Secure Login/Register using JWT.
- **User Management:** Admin can manage users, roles, and departments.
- **Monitoring:** Real-time data endpoints for machine load and status.
- **Forecasting:** Submit and approve forecast plans.
- **Simulation:** Background worker simulates data for testing/demo purposes.
- **Reporting:** Export monthly reports to CSV.

## 🧪 Background Services

- **SimulationWorker:** A background service that runs periodically to simulate machine load data and update status, useful for testing the monitoring dashboard without connecting to real SCADA systems.

## 📝 License
[MIT](LICENSE)
