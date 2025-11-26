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