## Website Monitoring Real-time Machine Status - Day 3

### 📋 Content
1. [Basic Reactjs Setup](#basic-reactjs-setup)
2. [React Components and Routing](#react-components-and-routing)
3. [React Frontend Setup](#react-frontend-setup)
4. [API Integration](#api-integration)

### Basic Reactjs Setup
1. ติดตั้ง Node.js และ npm
2. สร้างโปรเจค React ด้วย Vite
3. ทดสอบรันโปรเจค React
4. ติดตั้งแพ็กเกจ Axios

#### Step 1: ติดตั้ง Node.js และ npm
ดาวน์โหลดและติดตั้ง Node.js จาก [Node.js official website](https://nodejs.org/) ซึ่งจะมาพร้อมกับ npm (Node Package Manager)

#### Step 2: สร้างโปรเจค React ด้วย Vite
รันคำสั่งต่อไปนี้ใน terminal เพื่อสร้างโปรเจค React ใหม่ด้วย Vite:
```bash
cd WebMonitorHongsa
npm create vite@latest
```
เลือกชื่อโปรเจคเป็น `samplereact` และ template เป็น `react` และ type เป็น `TypeScript`

#### Step 3: ทดสอบรันโปรเจค React
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
cd samplereact
npm run dev
```
#### Step 4: ติดตั้ง tailwindcss v.4
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่ม tailwindcss ในโปรเจค
```bash
npm install tailwindcss @tailwindcss/vite
```

#### Step 5: import tailwindcss styles
Add an @import to ./src/index.css that imports Tailwind CSS.
```css
@import "tailwindcss";
```

#### Step 6: แก้ไข Configure Vite Plugin
Add the @tailwindcss/vite plugin to your Vite configuration.
เปิดไฟล์ `vite.config.ts` และเพิ่มโค้ดดังนี้:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})

```

#### Step 7: Edit tsconfig.json file
เปิดไฟล์ `tsconfig.json` และเพิ่มโค้ดดังนี้:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
#### Step 8: Edit tsconfig.app.json file
เปิดไฟล์ `tsconfig.app.json` และเพิ่มโค้ดดังนี้:
```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```

#### Step 9: Update vite.config.ts
เปิดไฟล์ `vite.config.ts` และเพิ่มโค้ดดังนี้:
```typescript
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

#### Step 10: Edit App.tsx file
แก้ไขไฟล์ `App.tsx` เพื่อทดสอบการใช้งาน tailwindcss
```typescript
function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold underline animate-bounce">
        Hello world!
      </h1>
    </div>
  )
}
export default App
```

#### Step 11: ทดสอบรันโปรเจค React อีกครั้ง
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
npm run dev
```

#### Step 12: ติดตั้ง Shadcn UI
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่ม Shadcn UI ในโปรเจค
```bash
npx shadcn@latest init
```
เลือก base color เป็น Neutral
```
Which color would you like to use as base color? › Neutral
```

#### Step 13: เพิ่ม Add Components button
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่มปุ่ม Button component
```bash
npx shadcn@latest add button
```

#### Step 14: แก้ไข App.tsx file
แก้ไขไฟล์ `App.tsx` เพื่อทดสอบการใช้งาน Shadcn UI และไอคอน
```typescript
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button>
        <Activity className="mr-2 h-4 w-4" />
        Click Me
      </Button>
    </div>
  )
}
export default App
```

#### Step 15: ทดสอบรันโปรเจค React อีกครั้ง
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
npm run dev
```
### React Components and Routing
1. ติดตั้ง react-router
2. สร้าง Navbar and Footer Component
3. สร้าง Layout Component
4. สร้าง Home , About , Contact Page Component
5. ตั้งค่า Routing

#### Step 16: ติดตั้ง react-router
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่ม react-router ในโปรเจค
```bash
npm install react-router
```

#### Step 17: สร้าง Navbar and Footer Component
สร้างโฟลเดอร์ `components` ในโฟลเดอร์ `src` และสร้างไฟล์ `Navbar.tsx` และ `Footer.tsx` ภายในโฟลเดอร์ `components` โดยเพิ่มโค้ดดังนี้:
**Navbar.tsx**
```typescript
import { Link } from "react-router"
function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <h1 className="text-xl font-bold">Web Monitor Hongsa</h1>
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/about" className="hover:underline">About</Link></li>
        <li><Link to="/contact" className="hover:underline">Contact</Link></li>
      </ul>
    </nav>
  )
}
export default Navbar
```

**Footer.tsx**
```typescript
function Footer() {
  return (
    <footer className="bg-gray-800 p-4 text-white mt-8">
      <p className="text-center">&copy; 2024 Web Monitor Hongsa. All rights reserved.</p>
    </footer>
  )
}
export default Footer
```

#### Step 18: สร้าง Layout Component
สร้างโฟลเดอร์ `layouts` ในโฟลเดอร์ `src` และสร้างไฟล์ `MainLayout.tsx` ภายในโฟลเดอร์ `layouts` โดยเพิ่มโค้ดดังนี้:
```typescript
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router"

function MainLayout() {
  return (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
  )
}

export default MainLayout
```

#### Step 19: สร้าง Home , About , Contact Page Component
สร้างโฟลเดอร์ `pages` ในโฟลเดอร์ `src` และสร้างไฟล์ `Home.tsx`, `About.tsx`, และ `Contact.tsx` ภายในโฟลเดอร์ `pages` โดยเพิ่มโค้ดดังนี้:
**Home.tsx**
```typescript
function Home() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Home Page</h2>
      <p>Welcome to the Web Monitor Hongsa application!</p>
    </div>
  )
}
export default Home
```

**About.tsx**
```typescript
function About() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">About Page</h2>
      <p>This application is designed to monitor real-time machine status.</p>
    </div>
  )
}
export default About
```

**Contact.tsx**
```typescript
function Contact() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Contact Page</h2>
      <p>If you have any questions, feel free to reach out!</p>
    </div>
  )
}
export default Contact
```

#### Step 20: สร้างไฟล์ routes.tsx
สร้างโฟลเดอร์ `routes` ในโฟลเดอร์ `src` และ สร้างไฟล์ `index.tsx` ในโฟลเดอร์ `routes` และเพิ่มโค้ดดังนี้:
```typescript
import { createBrowserRouter, RouterProvider } from "react-router"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"

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
            {
                path: "contact",
                element: <Contact />
            }
        ]
    }
])

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}
```

#### Step 21: แก้ไข App.tsx file
แก้ไขไฟล์ `App.tsx` เพื่อใช้งาน routing ที่สร้างขึ้น
```typescript
import { AppRouter } from "./routes"

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  )
}

export default App
```

#### Step 22: ทดสอบรันโปรเจค React อีกครั้ง
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
npm run dev
```

### React Frontend Setup

#### Step 23: สร้างโปรเจค React ด้วย Vite
รันคำสั่งต่อไปนี้ใน terminal เพื่อสร้างโปรเจค React ใหม่ด้วย Vite:
```bash
cd ..
cd hongsa-power-rtms
npm create vite@latest
```
เลือกชื่อโปรเจคเป็น `frontend` และ template เป็น `react` และ type เป็น `TypeScript`

#### Step 24: ทดสอบรันโปรเจค React
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
cd frontend
npm run dev
```

#### Step 25: ทำขั้นตอนที่ 4 - 21 ทบทวนอีกครั้งในโปรเจค `frontend`
ทำขั้นตอนที่ 4 - 21 ทบทวนอีกครั้งในโปรเจค `frontend` เพื่อให้ได้โครงสร้างโปรเจค React ที่สมบูรณ์

#### Step 26: สร้าง Layout Component สำหรับ Auth
สร้างไฟลฺ์ `AuthLayout.tsx` ในโฟลเดอร์ `layouts` โดยเพิ่มโค้ดดังนี้:
```typescript
import { Outlet } from "react-router"
function AuthLayout() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <Outlet />
    </div>
  )
}

export default AuthLayout
```

#### Step 27: สร้าง Login , Register , Forgotpassword Page Component
สร้างไฟล์ `Login.tsx`, `Register.tsx`, และ `Forgotpassword.tsx ภายในโฟลเดอร์ `pages` โดยเพิ่มโค้ดดังนี้:
**Login.tsx**
```typescript
function Login() {
  return (
    <div>
      Login Page
    </div>
  )
}

export default Login
```
**Register.tsx**
```typescript
function Register() {
  return (
    <div>
      Register Page
    </div>
  )
}

export default Register
```
**Forgotpassword.tsx**
```typescript
function Forgotpassword() {
  return (
    <div>
      Forgot Password Page
    </div>
  )
}

export default Forgotpassword
```

#### Step 28: แก้ไขไฟล์ routes.tsx
แก้ไขไฟล์ `routes/index.tsx` เพื่อเพิ่ม routing สำหรับหน้า Auth
```typescript
import { createBrowserRouter, RouterProvider } from "react-router"
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"
import Home from "@/pages/Home"
import About from "@/pages/About"
import Contact from "@/pages/Contact"
import Forgotpassword from "@/pages/Forgotpassword"
import Register from "@/pages/Register"
import Login from "@/pages/Login"

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
            {
                path: "contact",
                element: <Contact />
            }
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
    }
])

export const AppRouter = () => {
  return (
    <RouterProvider router={router} />
  )
}
```
#### Step 29: แก้ไข Navbar.tsx file
แก้ไขไฟล์ `Navbar.tsx` เพื่อเพิ่มลิงก์ไปยังหน้า Login และ Register
```typescript
import { Link } from "react-router"
function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">Web Monitor Hongsa</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/about" className="hover:underline">About</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      </div>
      
      <ul className="flex space-x-4">
        <li><Link to="/auth/login" className="hover:underline">Login</Link></li>
        <li><Link to="/auth/register" className="hover:underline">Register</Link></li>
      </ul>
    </nav>
  )
}
export default Navbar
```

#### Step 30: ทดสอบรันโปรเจค React อีกครั้ง
รันคำสั่งต่อไปนี้ใน terminal เพื่อทดสอบรันโปรเจค
```bash
npm run dev
```

#### Step 31: สร้าง component ที่ต้องใช้ซ้ำเช่น Label , Input , Button
รันคำสั่งต่อไปนี้ใน terminal เพื่อเพิ่มปุ่ม Button component
```bash
npx shadcn@latest add input
npx shadcn@latest add label
```

#### Step 32: แก้ไขหน้า AuthLayout.tsx ให้สวยงาม
แก้ไขไฟล์ `AuthLayout.tsx` เพื่อปรับแต่งหน้า AuthLayout ให้สวยงาม
```typescript
import { Outlet } from "react-router"
import { Zap, Activity, Server, CheckCircle2 } from "lucide-react"

function AuthLayout() {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      
      {/* Left Column: Visuals & Info */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-10 text-white overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 L0 50 Q50 0 100 50 L100 100 Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
           </svg>
        </div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">Hongsa Power <span className="text-blue-400">RTMS</span></span>
        </div>

        {/* Central Graphic: Abstract Dashboard */}
        <div className="relative z-10 flex flex-col items-center justify-center grow">
          <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-2xl animate-in zoom-in-95 duration-700">
            {/* Fake Header */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-400 font-mono">SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Fake Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Activity className="h-4 w-4 mr-2" />
                    <span className="text-xs">Current Load</span>
                  </div>
                  <div className="text-2xl font-bold text-white">120 <span className="text-sm text-slate-500 font-normal">MW</span></div>
                  <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[70%]" />
                  </div>
               </div>
               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Server className="h-4 w-4 mr-2" />
                    <span className="text-xs">Forecast Accuracy</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">98.5%</div>
                  <div className="flex items-center mt-2 text-xs text-slate-500">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Optimal
                  </div>
               </div>
            </div>

             {/* Fake Graph */}
             <div className="h-24 w-full bg-slate-900/30 rounded border border-slate-700/50 flex items-end p-2 space-x-1">
                {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-linear-to-t from-blue-900 to-blue-500 rounded-sm opacity-80 hover:opacity-100 transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
             </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium leading-relaxed">
              "ระบบ Real-time Machine Status ช่วยให้เราวางแผนการผลิตไฟฟ้าได้อย่างแม่นยำ ลดความผิดพลาด และเพิ่มประสิทธิภาพสูงสุดให้กับโรงไฟฟ้าหงสา"
            </p>
            <footer className="text-sm text-slate-400 font-medium">
              — ฝ่ายวางแผนและควบคุมการผลิต
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Forms */}
      <div className="flex items-center justify-center p-8 bg-white relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center space-x-2">
           <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
           <span className="text-xl font-bold tracking-wide text-slate-900">Hongsa RTMS</span>
        </div>

        <div className="w-full max-w-[380px] space-y-6">
          <Outlet />

          <div className="mt-8 text-center text-xs text-slate-400">
            &copy; 2025 Hongsa Power Company. All rights reserved. <br/>
            Secured by Hongsa RTMS System v1.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout

```

#### Step 33: ปรับหน้า Login , Register , Forgotpassword ให้สวยงามด้วย Shadcn UI
ใช้ Shadcn UI ในการปรับแต่งหน้า Login , Register , Forgotpassword ให้สวยงาม
ตัวอย่างเช่น ในไฟล์ `Login.tsx`:
```typescript

import { useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ยินดีต้อนรับกลับ</h1>
        <p className="text-sm text-slate-500">
          เข้าสู่ระบบเพื่อจัดการข้อมูลสถานะเครื่องจักร
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>ชื่อผู้ใช้งาน / อีเมล</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" placeholder="username หรือ email@example.com" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>รหัสผ่าน</Label>
            <Button variant="link" className="text-xs" asChild>
              <Link to="/auth/forgot-password">
                ลืมรหัสผ่าน?
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              className="pl-10 pr-10"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <Button className="w-full group">
          เข้าสู่ระบบ 
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">หรือ</span>
        </div>
      </div>

      <div className="text-center text-sm">
        ยังไม่มีบัญชีใช่ไหม?{" "}
        <Button variant="link" asChild>
          <Link to="/auth/register">
            ลงทะเบียนผู้ใช้งานใหม่
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Login

```
ตัวอย่างเช่น ในไฟล์ `Register.tsx`:

```typescript
import { Link } from "react-router"
import { User, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Register() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">
          สมัครสมาชิกเพื่อเริ่มใช้งานระบบ Forecasting
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>ชื่อผู้ใช้งาน (Username)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" placeholder="ตั้งชื่อผู้ใช้งานของคุณ" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>อีเมล</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" type="email" placeholder="name@company.com" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>รหัสผ่าน</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" type="password" placeholder="••••••••" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>ยืนยันรหัสผ่าน</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" type="password" placeholder="••••••••" />
          </div>
        </div>
        
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          สมัครสมาชิก
        </Button>
      </div>

      <div className="text-center text-sm">
        มีบัญชีอยู่แล้ว?{" "}
        <Button variant="link" asChild>
          <Link to="/auth/login">
            เข้าสู่ระบบ
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Register
```

ตัวอย่างเช่น ในไฟล์ `Forgotpassword.tsx`:
```typescript
import { Link } from "react-router"
import { Mail, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function Forgotpassword() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-blue-50 rounded-full">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ลืมรหัสผ่าน?</h1>
        <p className="text-sm text-slate-500">
          ไม่ต้องกังวล เราจะส่งคำแนะนำในการรีเซ็ตรหัสผ่านไปให้คุณทางอีเมล
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>อีเมลของคุณ</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input className="pl-10" type="email" placeholder="name@company.com" />
          </div>
        </div>
        
        <Button className="w-full">
          ส่งลิงก์รีเซ็ตรหัสผ่าน
        </Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" className="text-slate-500" asChild>
          <Link to="/auth/login">
            <ChevronLeft className="mr-2 h-4 w-4" /> กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Forgotpassword
```
