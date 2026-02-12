import axiosInstance from '@/api/axios'
import { API_ENDPOINTS } from '@/config/urls'

export async function getMovieMetadata() {
    const response = await axiosInstance.get(API_ENDPOINTS.MOVIES.METADATA)

    return response.data || {}
}