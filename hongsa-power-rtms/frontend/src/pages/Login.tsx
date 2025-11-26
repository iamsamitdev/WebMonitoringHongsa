
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function Login() {

  useEffect(() => {
    document.title = "Login | Hongsa Power RTMS";
  }, [])

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
        <Button className="w-full group cursor-pointer">
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
