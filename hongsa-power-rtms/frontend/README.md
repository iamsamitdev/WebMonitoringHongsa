# Hongsa Power RTMS Frontend

This is the frontend application for the **Hongsa Power Real-Time Monitoring System (RTMS)**. It is a modern single-page application (SPA) built with React 19 and Vite, designed to provide a responsive and interactive user interface for monitoring machine status, managing forecasts, and generating reports.

## 🚀 Technologies

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI + Tailwind)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **State/Forms:** React Hook Form
- **Icons:** Lucide React

## 📂 Project Structure

```
frontend/
├── src/
│   ├── assets/             # Static assets (images, fonts)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Base UI elements (Buttons, Inputs, Cards)
│   │   └── ...             # Layout components (Navbar, Sidebar)
│   ├── layouts/            # Page layouts (Auth, Backend, Main)
│   ├── lib/                # Utilities (cn, formatters)
│   ├── pages/              # Application pages
│   │   ├── backend/        # Protected pages (Dashboard, Users, Reports)
│   │   └── ...             # Public pages (Login, Home)
│   ├── routes/             # Route definitions
│   ├── services/           # API integration services
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
└── package.json            # Dependencies and scripts
```

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd hongsa-power-rtms/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root directory (or copy `.env.local` if available) and set your API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## 🔑 Key Features

- **Dashboard:** Real-time visualization of machine load and status using interactive charts.
- **Authentication:** Secure Login and Registration pages with JWT integration.
- **User Management:** Admin interface to Add, Edit, and Delete users with role assignment.
- **Simulation Input:** Interface to control simulation parameters for testing.
- **Reporting:** Monthly report generation and CSV export.
- **Responsive Design:** Fully responsive layout for desktop and mobile devices.

## 🎨 UI/UX

The project uses a clean and professional design system based on **Tailwind CSS**.
- **Layouts:** Distinct layouts for Public (Home), Auth (Login/Register), and Backend (Dashboard) areas.
- **Components:** Modular components for consistency and reusability.
- **Feedback:** Toast notifications (Sonner) for user actions.

## 📝 License
[MIT](LICENSE)
