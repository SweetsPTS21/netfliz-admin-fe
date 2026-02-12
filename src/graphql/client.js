import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'
import { SetContextLink } from '@apollo/client/link/context'
import { GRAPHQL_URL, AUTH_BASE_URL } from '@/config/urls'
import axios from 'axios'
import { message } from 'antd'

// ---------- Refresh token logic ----------
let isRefreshing = false
let pendingRequests = []

const resolvePendingRequests = (token) => {
    pendingRequests.forEach((callback) => callback(token))
    pendingRequests = []
}

const handleSessionExpired = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    setTimeout(() => {
        window.location.replace('/login')
    }, 1500)
}

const refreshAccessToken = async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (!refreshTokenValue) {
        throw new Error('No refresh token')
    }

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

    return newAccessToken
}

/**
 * Custom fetch that intercepts 401 at the HTTP level.
 * Apollo's ErrorLink can't reliably detect raw 401 responses,
 * so we handle it here before Apollo processes the response.
 */
const fetchWithRefresh = async (uri, options) => {
    let response = await fetch(uri, options)

    if (response.status === 401) {
        // If already refreshing, wait for the ongoing refresh
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingRequests.push((newToken) => {
                    options.headers.Authorization = `Bearer ${newToken}`
                    fetch(uri, options).then(resolve).catch(reject)
                })
            })
        }

        isRefreshing = true

        try {
            const newToken = await refreshAccessToken()
            resolvePendingRequests(newToken)

            // Retry the original request with the new token
            options.headers.Authorization = `Bearer ${newToken}`
            response = await fetch(uri, options)
        } catch {
            pendingRequests = []
            handleSessionExpired()
        } finally {
            isRefreshing = false
        }
    }

    return response
}

// Inject Authorization header from localStorage
const authLink = new SetContextLink((_, { headers }) => {
    const token = localStorage.getItem('accessToken')
    return {
        headers: {
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    }
})

const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    fetch: fetchWithRefresh,
})

const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
})

export default client
