import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  employeeId: string
  departmentName: string
  role: string
  status: string
}

export interface CreateUserDto {
  username: string
  email: string
  password?: string
  firstName: string
  lastName: string
  employeeId: string
  departmentName: string
  role: string
}

export interface UpdateUserDto {
  firstName: string
  lastName: string
  employeeId: string
  departmentName: string
  role: string
}

const getAuthHeader = () => {
  const token = localStorage.getItem("token")
  return { Authorization: `Bearer ${token}` }
}

export const getAllUsers = async () => {
  const response = await axios.get<User[]>(`${BASE_URL}/User`, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const getUserById = async (id: string) => {
  const response = await axios.get<User>(`${BASE_URL}/User/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const createUser = async (data: CreateUserDto) => {
  const response = await axios.post(`${BASE_URL}/User`, data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const updateUser = async (id: string, data: UpdateUserDto) => {
  const response = await axios.put(`${BASE_URL}/User/${id}`, data, {
    headers: getAuthHeader(),
  })
  return response.data
}

export const deleteUser = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/User/${id}`, {
    headers: getAuthHeader(),
  })
  return response.data
}
