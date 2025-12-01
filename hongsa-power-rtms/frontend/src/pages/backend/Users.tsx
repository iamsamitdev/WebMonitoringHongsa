import { UserPlus, Shield, Trash2, Edit, X, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getAllUsers, createUser, updateUser, deleteUser, type User, type CreateUserDto } from "@/services/apiUser"

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CreateUserDto>({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    employeeId: "",
    departmentName: "",
    role: "User"
  })

  useEffect(() => {
    document.title = "User Management | Hongsa Power RTMS"
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateUser(editingId, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            employeeId: formData.employeeId,
            departmentName: formData.departmentName,
            role: formData.role
        })
        toast.success("User updated successfully")
      } else {
        await createUser(formData)
        toast.success("User created successfully")
      }
      setIsModalOpen(false)
      fetchUsers()
      resetForm()
    } catch (error: unknown) {
      console.error(error)
      const err = error as { response?: { data?: { message?: string | string[] } | string } }
      const msg = (typeof err.response?.data === 'object' && err.response?.data && 'message' in err.response.data) 
        ? err.response.data.message 
        : err.response?.data || "Operation failed"
      if (Array.isArray(msg)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toast.error((msg as unknown[]).map((e: any) => e.description || e).join(", "))
      } else if (typeof msg === 'object') {
           toast.error(JSON.stringify(msg))
      } else {
          toast.error(String(msg))
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return
    
    try {
      await deleteUser(id)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete user")
    }
  }

  const openEditModal = (user: User) => {
    setEditingId(user.id)
    setFormData({
        username: user.username,
        email: user.email,
        password: "", 
        firstName: user.firstName,
        lastName: user.lastName,
        employeeId: user.employeeId,
        departmentName: user.departmentName,
        role: user.role
    })
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
      resetForm()
      setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        employeeId: "",
        departmentName: "",
        role: "User"
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <button 
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
            <div className="p-8 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        ) : (
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-3 font-bold">
                      {user.firstName?.charAt(0) || user.username?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.employeeId || "-"}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.departmentName || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "Admin" && (
                      <Shield className="w-3 h-3 mr-1" />
                    )}
                    {user.role || "User"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(user)} className="text-slate-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No users found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!editingId && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Username</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">First Name</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Last Name</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Employee ID</label>
                            <input 
                                type="text" 
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Department</label>
                            <input 
                                type="text" 
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Role</label>
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        >
                            {editingId ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  )
}

export default Users