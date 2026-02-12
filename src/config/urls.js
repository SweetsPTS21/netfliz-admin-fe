// Base URLs and endpoints configuration
export const AUTH_BASE_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080/api/v1'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084/api/v1'
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8084/graphql'
export const WEB_SOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8084'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${AUTH_BASE_URL}/auth/authenticate`,
    LOGOUT: `${AUTH_BASE_URL}/auth/logout`,
    REFRESH: `${AUTH_BASE_URL}/auth/refresh-token`,
    REGISTER: `${AUTH_BASE_URL}/auth/register`,
    PROFILE: `${AUTH_BASE_URL}/auth/profile`,
  },
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    DETAIL: (id) => `${API_BASE_URL}/users/${id}`,
    CREATE: `${API_BASE_URL}/users`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change-password`,
    DISABLE: (id) => `${API_BASE_URL}/users/${id}/disable`,
  },
  MOVIES: {
    LIST: `${API_BASE_URL}/movies`,
    DETAIL: (id) => `${API_BASE_URL}/movies/${id}`,
    CREATE: `${API_BASE_URL}/movies`,
    UPDATE: (id) => `${API_BASE_URL}/movies/${id}`,
    DELETE: (id) => `${API_BASE_URL}/movies/${id}`,
    SEARCH: `${API_BASE_URL}/movies/search`,
    METADATA: `${API_BASE_URL}/movies/metadata`,
  },
  SERIES: {
    LIST: `${API_BASE_URL}/series`,
    DETAIL: (id) => `${API_BASE_URL}/series/${id}`,
    CREATE: `${API_BASE_URL}/series`,
    UPDATE: (id) => `${API_BASE_URL}/series/${id}`,
    DELETE: (id) => `${API_BASE_URL}/series/${id}`,
    SEARCH: `${API_BASE_URL}/series/search`,
  },
  CATEGORIES: {
    LIST: `${API_BASE_URL}/categories`,
    DETAIL: (id) => `${API_BASE_URL}/categories/${id}`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id) => `${API_BASE_URL}/categories/${id}`,
  },
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats`,
    RECENT: `${API_BASE_URL}/dashboard/recent`,
    ANALYTICS: `${API_BASE_URL}/dashboard/analytics`,
  },
}

// Frontend routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  USER_DETAIL: (id) => `/users/${id}`,
  MOVIES: '/movies',
  MOVIE_DETAIL: (id) => `/movies/${id}`,
  SERIES: '/series',
  SERIES_DETAIL: (id) => `/series/${id}`,
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: (id) => `/categories/${id}`,
  SETTINGS: '/settings',
  PROFILE: '/profile',
}

// External URLs
export const EXTERNAL_URLS = {
  DOCS: 'https://docs.netfliz.com',
  SUPPORT: 'https://support.netfliz.com',
  GITHUB: 'https://github.com/netfliz',
}

export default {
  AUTH_BASE_URL,
  API_BASE_URL,
  GRAPHQL_URL,
  WEB_SOCKET_URL,
  API_ENDPOINTS,
  ROUTES,
  EXTERNAL_URLS,
}
