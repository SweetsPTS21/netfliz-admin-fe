import axiosInstance from '@/api/axios'
import { API_ENDPOINTS } from '@/config/urls'

export const signIn = async (email, password) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
    })
    return response.data
}

export const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken')
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken: token,
    })
    return response.data
}

export const getMe = async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.PROFILE)
    return response.data
}

export const logoutApi = async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT)
    return response.data
}
