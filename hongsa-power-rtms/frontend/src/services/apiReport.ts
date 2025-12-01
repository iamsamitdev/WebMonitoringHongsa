import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export const exportMonthlyReport = async (month: number, year: number) => {
  const token = localStorage.getItem("token")
  const response = await axios.get(`${BASE_URL}/Report/export`, {
    params: { month, year },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob', // สำคัญมากสำหรับการดาวน์โหลดไฟล์
  })
  return response
}
