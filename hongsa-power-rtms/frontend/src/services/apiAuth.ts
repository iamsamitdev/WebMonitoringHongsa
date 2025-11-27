import axios from "axios"

// กำหนดตัวแปรสำหรับ URL ของ API จากไฟล์ .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Interface สำหรับข้อมูลการเข้าสู่ระบบ
interface LoginData {
  username: string
  password: string
}

// Interface สำหรับข้อมูลการลงทะเบียน
interface RegisterData {
  firstName: string
  lastName: string
  employeeId: string
  departmentName: string
  username: string
  email: string
  password: string
}

// สร้าง Config สำหรับ Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 วินาที
})

// ฟังก์ชันสำหรับการเข้าสู่ระบบ
const authLogin = async (data: LoginData) => {
  const response = await api.post("/Authenticate/login", data)
  return response.data
}

// ฟังก์ชันสำหรับการลงทะเบียน
const authRegister = async (data: RegisterData) => {
  const response = await api.post("/Authenticate/register-user", data)
  return response.data
}

export { authLogin, authRegister }
export type { LoginData, RegisterData }