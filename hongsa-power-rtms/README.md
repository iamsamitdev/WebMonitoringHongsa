# Hongsa Power Real-Time Monitoring System (RTMS)

Welcome to the **Hongsa Power RTMS** repository. This project is a comprehensive solution for real-time monitoring, load forecasting, and reporting for power plant operations. It consists of a modern web frontend and a robust backend API.

## 🏗️ Architecture

The project is structured as a monorepo containing two main applications:

- **Backend (`/backend`)**: A RESTful API built with **.NET 10** and **Entity Framework Core**, responsible for data management, authentication, and background simulation processes.
- **Frontend (`/frontend`)**: A Single Page Application (SPA) built with **React 19**, **Vite**, and **Tailwind CSS**, providing an interactive dashboard and management interface.

## 🚀 Technologies

### Backend
- **Framework:** .NET 10 (ASP.NET Core Web API)
- **Database:** SQL Server
- **ORM:** Entity Framework Core
- **Docs:** Scalar (OpenAPI)

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Library:** Shadcn UI
- **Charts:** Recharts

## 📂 Project Structure

```
hongsa-power-rtms/
├── backend/                # .NET Web API Project
│   ├── Controllers/        # API Endpoints
│   ├── Models/             # Database Entities
│   └── Services/           # Business Logic & Background Workers
│
├── frontend/               # React + Vite Project
│   ├── src/
│   │   ├── pages/          # UI Pages (Dashboard, Users, etc.)
│   │   └── services/       # API Integration
│   └── public/             # Static Assets
│
└── README.md               # This file
```

## 🏁 Getting Started

To run the full system locally, you will need to start both the backend and frontend servers.

### Prerequisites
- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [SQL Server](https://www.microsoft.com/sql-server/)

### 1. Setup Backend
Navigate to the backend directory and start the API.

```bash
cd backend
# Update appsettings.json with your SQL Connection String
dotnet ef database update
dotnet watch run
```
*The API will start at `http://localhost:5000` (or configured port).*

### 2. Setup Frontend
Open a new terminal, navigate to the frontend directory, and start the UI.

```bash
cd frontend
npm install
npm run dev
```
*The Frontend will start at `http://localhost:5173`.*

## 📚 Documentation

For detailed documentation on specific parts of the system, please refer to the README files in their respective directories:

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## ✨ Key Features

- **Real-time Dashboard:** Monitor machine load and status updates live.
- **Simulation Mode:** Built-in background worker to simulate SCADA data for testing.
- **User Management:** Role-based access control (Admin/User).
- **Forecasting:** Tools for planning and approving power generation forecasts.
- **Reporting:** Export detailed CSV reports for analysis.

## 📝 License

This project is licensed under the MIT License.
