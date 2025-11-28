import { createBrowserRouter, RouterProvider } from "react-router"

// Layout
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"
import BackendLayout from "@/layouts/BackendLayout"

// Frontend Pages
import Home from "@/pages/Home"
import About from "@/pages/About"

// Auth Pages
import Forgotpassword from "@/pages/Forgotpassword"
import Register from "@/pages/Register"
import Login from "@/pages/Login"

// Backend Pages
import Dashboard from "@/pages/backend/Dashboard"
import Simulation from "@/pages/backend/Simulation"
import Planning from "@/pages/backend/Planning"
import Approval from "@/pages/backend/Approval"
import Reports from "@/pages/backend/Reports"
import Users from "@/pages/backend/Users"

// Protected Route
import ProtectedRoute from "@/components/ProtectedRoute"

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "about",
                element: <About />
            },
        ]
    },
    {
        path: "auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <Forgotpassword />
            }
        ]
    },
    {
        path: "backend",
        element: <ProtectedRoute />,
        children: [
            {
                element: <BackendLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "simulation",
                        element: <Simulation />
                    },
                    {
                        path: "planning",
                        element: <Planning />
                    },
                    {
                        path: "approval",
                        element: <Approval />
                    },
                    {
                        path: "reports",
                        element: <Reports />
                    },
                    {
                        path: "users",
                        element: <Users />
                    }
                ]
            }
        ]
    }
])

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}