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

#### Step 34: ปรับหน้า Navbar.tsx ให้รองรับการแสดงผลบนมือถือ
แก้ไขไฟล์ `Navbar.tsx` เพื่อเพิ่มปุ่มเมนูสำหรับแสดงผลบนมือถือ
```typescript
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Zap, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'หน้าหลัก', path: '/' },
    { name: 'เกี่ยวกับระบบ', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">
              Hongsa <span className="text-blue-400">RTMS</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 pl-8 border-l border-slate-700">
              <Link
                to="/auth/login"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-slate-700 mt-4 flex flex-col space-y-2">
              <Link
                to="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white text-center mx-3"
              >
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar
```
##### Step 35: ปรับหน้า Footer.tsx ให้รองรับการแสดงผลบนมือถือ
แก้ไขไฟล์ `Footer.tsx` เพื่อปรับแต่งหน้า Footer ให้รองรับการแสดงผลบนมือถือ
```typescript
import { Zap, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-wide">
                Hongsa <span className="text-blue-500">RTMS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              ระบบติดตามสถานะเครื่องจักรและพยากรณ์กำลังการผลิตไฟฟ้าแบบ Real-time เพื่อประสิทธิภาพสูงสุดในการบริหารจัดการพลังงาน
            </p>
          </div>

          {/* Quick Links (Hidden on small mobile for compactness) */}
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">เมนูลัด</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">หน้าหลัก</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">เกี่ยวกับระบบ</Link></li>
              <li><Link to="/auth/login" className="hover:text-blue-400 transition-colors">สำหรับเจ้าหน้าที่</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-blue-500 shrink-0" />
                <span>Hongsa Power Company Ltd.<br />Xayaboury Province, Laos</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-500 shrink-0" />
                <span>+856 20 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-500 shrink-0" />
                <span>support@hongsapower.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} Hongsa Power Company. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer
```

#### Step 36: ปรับหน้า Home.tsx ให้รองรับการแสดงผลบนมือถือ
แก้ไขไฟล์ `Home.tsx` เพื่อปรับแต่งหน้า Home ให้รองรับการแสดงผลบนมือถือ
```typescript
import { Link } from 'react-router';
import { ArrowRight, Activity, BarChart3, Bell } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-900">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(37,99,235,0.4)_0%,rgba(0,0,0,0)_60%)] animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-6">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Monitoring System v1.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            ยกระดับการจัดการพลังงาน <br className="hidden md:block" />
            ด้วยระบบ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Smart Forecasting</span>
          </h1>
          
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            ติดตามสถานะเครื่องจักรและวางแผนการผลิตไฟฟ้าของโรงไฟฟ้าหงสาได้อย่างแม่นยำ รวดเร็ว และมีประสิทธิภาพสูงสุด
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/auth/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              เข้าสู่ระบบ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/about"
              className="inline-flex items-center justify-center px-8 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-transparent hover:bg-slate-800 md:text-lg transition-all"
            >
              เรียนรู้เพิ่มเติม
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">ฟีเจอร์หลักของระบบ</h2>
            <p className="mt-4 text-lg text-slate-600">ออกแบบมาเพื่อตอบโจทย์การทำงานของวิศวกรและผู้ดูแลระบบ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Activity}
              title="Real-time Monitoring"
              description="ติดตามค่า Load และสถานะการทำงานของเครื่องจักรได้ทันที ทุกที่ ทุกเวลา ข้อมูลอัปเดตระดับวินาที"
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Advance Forecasting"
              description="ระบบคำนวณและพยากรณ์กำลังการผลิตล่วงหน้าด้วยข้อมูลสถิติ ช่วยให้การวางแผนแม่นยำยิ่งขึ้น"
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <FeatureCard 
              icon={Bell}
              title="Smart Notifications"
              description="แจ้งเตือนทันทีเมื่อมีความผิดปกติ หรือค่า Actual แตกต่างจาก Forecast เกินเกณฑ์ที่กำหนด ผ่าน Line และ Email"
              color="text-amber-600"
              bg="bg-amber-50"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bg: string;
}

const FeatureCard = ({ icon: Icon, title, description, color, bg }: FeatureCardProps) => (
  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-6`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {description}
    </p>
  </div>
);
export default Home
```

#### Step 37: ปรับหน้า About.tsx ให้รองรับการแสดงผลบนมือถือ
แก้ไขไฟล์ `About.tsx` เพื่อปรับแต่งหน้า About ให้รอง
```typescript
import { CheckCircle2, Server, Database, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">เกี่ยวกับระบบ RTMS</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ระบบบริหารจัดการสถานะเครื่องจักรและพยากรณ์กำลังการผลิต สำหรับโรงไฟฟ้าหงสา (Hongsa Power)
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Mission Section */}
          <div className="p-8 md:p-12 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <span className="w-1 h-8 bg-blue-600 rounded-full mr-4"></span>
              วัตถุประสงค์โครงการ
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>
                โครงการพัฒนาระบบ <strong>Real Time Machine Status & Forecasting</strong> นี้จัดทำขึ้นเพื่อแก้ปัญหาความล่าช้าและความผิดพลาดในการบันทึกข้อมูลแบบ Manual เดิม โดยมีเป้าหมายหลักคือ:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <ListItem text="ลดระยะเวลาในการรวบรวมข้อมูลและทำรายงาน (Daily Report)" />
                <ListItem text="เพิ่มความแม่นยำในการพยากรณ์ (Forecast) ด้วยข้อมูลสถิติ" />
                <ListItem text="ติดตามสถานะเครื่องจักรได้แบบ Real-time ผ่าน Web Application" />
                <ListItem text="แจ้งเตือนทันทีเมื่อเกิดความคลาดเคลื่อนในการผลิตไฟฟ้า" />
              </ul>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="p-8 md:p-12 bg-slate-50/50">
             <h2 className="text-2xl font-bold text-slate-900 mb-6">เทคโนโลยีที่ใช้</h2>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <TechCard 
                  icon={Users} 
                  title="Frontend" 
                  desc="React 19 + Tailwind CSS เพื่อการใช้งานที่ลื่นไหลและรองรับทุกอุปกรณ์" 
                />
                <TechCard 
                  icon={Server} 
                  title="Backend" 
                  desc=".NET 10 Web API ที่มีความปลอดภัยและประสิทธิภาพสูง" 
                />
                <TechCard 
                  icon={Database} 
                  title="Database" 
                  desc="SQL Server 2022 สำหรับจัดการข้อมูลขนาดใหญ่และประวัติย้อนหลัง" 
                />
             </div>
          </div>

          {/* Contact Section */}
          <div className="p-8 md:p-12 bg-blue-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">ต้องการความช่วยเหลือ?</h2>
            <p className="text-blue-100 mb-6">
              หากพบปัญหาในการใช้งาน หรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถติดต่อทีม IT Support
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
              ติดต่อ Support
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

interface ListItemProps {
  text: string;
}

const ListItem = ({ text }: ListItemProps) => (
  <li className="flex items-start">
    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

interface TechCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const TechCard = ({ icon: Icon, title, desc }: TechCardProps) => (
  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3 text-slate-700">
      <Icon size={20} />
    </div>
    <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600">{desc}</p>
  </div>
);
export default About
```
