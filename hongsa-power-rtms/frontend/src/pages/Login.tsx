import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { authLogin, type LoginData } from "@/services/apiAuth"
import { toast } from "sonner"


function Login() {

  useEffect(() => {
    document.title = "Login | Hongsa Power RTMS";
  }, [])

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()

  const onSubmit = async (data: LoginData) => {
    console.log(data)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await authLogin(data)
      console.log("Login successful:", response)
      
      // Store Auth Data
      localStorage.setItem("token", response.token)
      localStorage.setItem("roles", JSON.stringify(response.roles))
      localStorage.setItem("username", data.username)
      localStorage.setItem("firstName", response.firstName)
      localStorage.setItem("lastName", response.lastName)
      
      toast.success("เข้าสู่ระบบสำเร็จ", {
        description: "ยินดีต้อนรับกลับ",
      })

      // Redirect to Dashboard
      navigate("/backend/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (error as any).response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      toast.error("เข้าสู่ระบบไม่สำเร็จ", {
        description: errorMessage,
      })
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">ยินดีต้อนรับกลับ</h1>
        <p className="text-sm text-slate-500">
          เข้าสู่ระบบเพื่อจัดการข้อมูลสถานะเครื่องจักร
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>ชื่อผู้ใช้งาน (Username)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              id="username"
              {...register("username", { 
                required: "กรอกชื่อผู้ใช้งาน (username)" ,
                minLength: { 
                  value: 3, message: "ความยาวอย่างน้อย 3 ตัวอักษร" 
                }
              })}
              className={`pl-10 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              placeholder="username" 
            />
          </div>
          {errors.username && <p className="text-red-500 text-xs">{errors.username.message as string}</p>}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>รหัสผ่าน (Password)</Label>
            <Button variant="link" className="text-xs" asChild>
              <Link to="/auth/forgot-password">
                ลืมรหัสผ่าน?
              </Link>
            </Button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input 
              id="password"
              {...register("password", { 
                required: "กรอกรหัสผ่าน",
                minLength: { value: 8, message: "ความยาวอย่างน้อย 8 ตัวอักษร" } 
              })}
              className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
        </div>
        <Button type="submit" className="w-full group cursor-pointer">
          เข้าสู่ระบบ 
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

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