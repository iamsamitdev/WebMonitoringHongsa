import { Link } from "react-router"
import { User, Mail, Lock, IdCard, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import { useForm } from 'react-hook-form'
import { authRegister, type RegisterData } from "@/services/apiAuth"

// สร้าง Interface สำหรับ Form โดยเฉพาะ (รวม confirmPassword)
interface RegisterFormInputs extends RegisterData {
  confirmPassword?: string
}

function Register() {

  // ตั้ง title หน้า
  useEffect(() => {
    document.title = "Register | Hongsa Power RTMS"
  }, [])

  // การใช้ React Hook Form
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>()

  // ดูค่า password เพื่อใช้เทียบกับ confirm password
  const password = watch("password")

  // ฟังก์ชันเมื่อ Submit form
  const onSubmit = async (data: RegisterFormInputs) => {
    // แยก confirmPassword ออกจากข้อมูลที่จะส่งไป API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data

    console.log(registerData);
    try {
      const response = await authRegister(registerData)
      console.log("Registration successful:", response)
      // สามารถเพิ่มการแจ้งเตือนหรือเปลี่ยนหน้าได้ที่นี่
    } catch (error) {
      console.error("Registration failed:", error)
      // สามารถเพิ่มการแจ้งเตือนข้อผิดพลาดได้ที่นี่
    }
  }

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">สร้างบัญชีใหม่</h1>
        <p className="text-sm text-slate-500">
          สมัครสมาชิกเพื่อเริ่มใช้งานระบบ Forecasting
        </p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ชื่อ (First Name)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="firstName" 
                  {...register("firstName", { required: "กรุณากรอกชื่อของคุณ" })} 
                  className={`pl-10 ${errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  placeholder="กรุณากรอกชื่อของคุณ" />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label>นามสกุล (Last Name)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="lastName" 
                  {...register("lastName", { required: "กรุณากรอกนามสกุลของคุณ" })} 
                  className={`pl-10 ${errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  placeholder="กรุณากรอกนามสกุลของคุณ" />
              </div>
              <p className="text-red-500 text-xs">{errors.lastName?.message as string}</p>
            </div>
            <div className="space-y-2">
              <Label>รหัสพนักงาน (Employee ID)</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="employeeId" 
                  {...register("employeeId", { required: "กรุณากรอกรหัสพนักงานของคุณ" })} 
                  className={`pl-10 ${errors.employeeId ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  placeholder="กรุณากรอกรหัสพนักงานของคุณ" />
              </div>
              {errors.employeeId && <p className="text-red-500 text-xs">{errors.employeeId.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label>แผนก (Department Name)</Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="departmentName" 
                  {...register("departmentName", { required: "กรุณากรอกแผนกของคุณ" })} 
                  className={`pl-10 ${errors.departmentName ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  placeholder="กรุณากรอกแผนกของคุณ" />
              </div>
              {errors.departmentName && <p className="text-red-500 text-xs">{errors.departmentName.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label>ชื่อผู้ใช้งาน (Username)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="username" 
                  {...register("username", { required: "กรุณากรอกชื่อผู้ใช้งานของคุณ" })} 
                  className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  placeholder="ตั้งชื่อผู้ใช้งานของคุณ" />
              </div>
              {errors.username && <p className="text-red-500 text-xs">{errors.username.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label>อีเมล (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="email" 
                  {...register("email", { required: "กรุณากรอกอีเมลของคุณ" })} 
                  className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  type="email" placeholder="name@company.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="password" 
                  {...register("password", { required: "กรุณากรอกรหัสผ่านของคุณ" })} 
                  className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  type="password" placeholder="••••••••" />
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
            </div>
            <div className="space-y-2">
              <Label>ยืนยันรหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  id="confirmPassword" 
                  {
                      ...register("confirmPassword", { 
                      required: "กรุณากรอกยืนยันรหัสผ่านของคุณ",
                      validate: value => value === password || "รหัสผ่านไม่ตรงกัน"
                    })
                  } 
                  className={`pl-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`} 
                  type="password" placeholder="••••••••" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message as string}</p>}
            </div>
          </div>
        
        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
          สมัครสมาชิก
        </Button>
        </form>
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
