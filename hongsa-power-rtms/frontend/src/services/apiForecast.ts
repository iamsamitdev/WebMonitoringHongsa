import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Types
export interface MachineStatusConfig {
  statusID: number
  statusName: string
  colorCode: string
  isRun: boolean
  defaultLoadMW?: number
}

export interface SubmitPlanItem {
  startTime: string
  endTime: string
  statusID: number
}

export interface SubmitPlanDto {
  targetDate: string // YYYY-MM-DD
  items: SubmitPlanItem[]
}

// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add Request Interceptor to include Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API Functions
export const getForecastConfig = async () => {
  const response = await api.get("/Forecast/config")
  return response.data // { machineStatus: [...] }
}

export const submitForecastPlan = async (data: SubmitPlanDto) => {
  const response = await api.post("/Forecast/submit", data)
  return response.data
}

// --- Approval & Admin ---

export interface ForecastRequest {
  requestID: number
  targetDate: string
  revisionNo: number
  requestStatus: string
  submittedBy: string
  submittedDate: string
  adminComment?: string
  submitter?: {
      firstName: string
      lastName: string
      userName: string
  }
  items?: {
      startTime: string
      endTime: string
      statusID: number
      statusConfig?: {
          statusName: string
      }
  }[]
}

export interface PreviewItem {
  startTime: string
  endTime: string
  statusID: number
  statusName: string
  calculatedMW: number
  sourceLogic: string
}

export interface ApproveItem {
  startTime: string
  endTime: string
  finalLoadMW: number
}

export interface ApprovePlanDto {
  requestID: number
  items: ApproveItem[]
}

export interface ReturnPlanDto {
  requestID: number
  comment: string
}

export const getPendingForecasts = async () => {
  const response = await api.get<ForecastRequest[]>("/Forecast/pending")
  return response.data
}

export const getForecastPreview = async (requestId: number) => {
  const response = await api.get<PreviewItem[]>(`/Forecast/${requestId}/preview`)
  return response.data
}

export const approveForecastPlan = async (data: ApprovePlanDto) => {
  const response = await api.post("/Forecast/approve", data)
  return response.data
}

export const returnForecastPlan = async (data: ReturnPlanDto) => {
  const response = await api.post("/Forecast/return", data)
  return response.data
}

export const getMyForecastHistory = async () => {
  const response = await api.get<ForecastRequest[]>("/Forecast/history")
  return response.data
}

export const getAllForecastHistory = async () => {
  const response = await api.get<ForecastRequest[]>("/Forecast/all-history")
  return response.data
}