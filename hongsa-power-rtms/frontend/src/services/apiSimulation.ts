import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export interface SimInputDto {
  actualLoadMW: number
}

export const sendSimulationData = async (data: SimInputDto) => {
  const token = localStorage.getItem("token")
  const response = await axios.post(`${BASE_URL}/Simulation/input`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
