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
