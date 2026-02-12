import axiosInstance from '@/api/axios'
import { API_ENDPOINTS } from '@/config/urls'

export const changeUserPassword = async (id, newPassword) => {
    const response = await axiosInstance.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        id: id,
        password: newPassword,
    })
    return response.data
}

export const disableUser = async (id) => {
    const response = await axiosInstance.put(API_ENDPOINTS.USERS.DISABLE(id))
    return response.data
}

export const deleteUserApi = async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id))
    return response.data
}
