import axios from 'axios'
import { message } from 'antd'
import { API_BASE_URL, AUTH_BASE_URL } from '@/config/urls'

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor — attach accessToken
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// ---------- Refresh token logic ----------
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error)
        } else {
            promise.resolve(token)
        }
    })
    failedQueue = []
}

const handleSessionExpired = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    setTimeout(() => {
        window.location.replace('/login')
    }, 1500)
}

// Response interceptor — try refresh on 401
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Only attempt refresh on 401 and if not already retried
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error)
        }

        // Don't try to refresh the refresh-token request itself
        if (originalRequest.url?.includes('/auth/refresh-token')) {
            handleSessionExpired()
            return Promise.reject(error)
        }

        // If another request is already refreshing, queue this one
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return axiosInstance(originalRequest)
                })
                .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            const refreshTokenValue = localStorage.getItem('refreshToken')
            if (!refreshTokenValue) {
                throw new Error('No refresh token')
            }

            // Call refresh endpoint with a clean axios instance (avoid interceptor loop)
            const { data } = await axios.post(
                `${AUTH_BASE_URL}/auth/refresh-token`,
                { refreshToken: refreshTokenValue },
                { headers: { 'Content-Type': 'application/json' } },
            )

            const newAccessToken = data?.data?.accessToken || data?.accessToken
            const newRefreshToken = data?.data?.refreshToken || data?.refreshToken

            if (!newAccessToken) {
                throw new Error('Refresh failed')
            }

            localStorage.setItem('accessToken', newAccessToken)
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken)
            }

            processQueue(null, newAccessToken)

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axiosInstance(originalRequest)
        } catch (refreshError) {
            processQueue(refreshError, null)
            handleSessionExpired()
            return Promise.reject(refreshError)
        } finally {
            isRefreshing = false
        }
    },
)

export default axiosInstance
