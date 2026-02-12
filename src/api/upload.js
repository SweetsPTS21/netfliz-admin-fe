import axiosInstance from '@/api/axios'
import { API_ENDPOINTS } from '@/config/urls'

export const uploadPoster = async (formData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FILE.UPLOAD_POSTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}

export const uploadGallery = async (formData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FILE.UPLOAD_GALLERY, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}
