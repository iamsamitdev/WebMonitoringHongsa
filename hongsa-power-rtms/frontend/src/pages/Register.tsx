import { Link } from "react-router"
import { User, Mail, Lock, IdCard, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import { useForm } from 'react-hook-form'

function Register() {

  // ตั้ง title หน้า
  useEffect(() => {
    document.title = "Register | Hongsa Power RTMS"
  }, [])

  // การใช้ React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">
          สมัครสมาชิกเพื่อเริ่มใช้งานระบบ Forecasting
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ชื่อ (First Name)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input className="pl-10" placeholder="กรุณากรอกชื่อของคุณ" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>นามสกุล (Last Name)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input className="pl-10" placeholder="กรุณากรอกนามสกุลของคุณ" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>รหัสพนักงาน (Employee ID)</Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input className="pl-10" placeholder="กรุณากรอกรหัสพนักงานของคุณ" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>แผนก (Department Name)</Label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input className="pl-10" placeholder="กรุณากรอกแผนกของคุณ" />
            </div>
          </div>
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
        </div>
        
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
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
