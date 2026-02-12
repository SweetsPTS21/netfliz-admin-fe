import { createBrowserRouter } from 'react-router-dom'
import Login from '@/components/Login'
import AdminLayout from '@/components/layout/AdminLayout'
import Dashboard from '@/components/dashboard/Dashboard'
import MovieContextProvider from '@/contexts/MovieContext'
import MovieList from '@/components/movie/MovieList'
import UserContextProvider from '@/contexts/UserContext'
import UserList from '@/components/user/UserList'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'movies',
                element: (
                    <MovieContextProvider>
                        <MovieList />
                    </MovieContextProvider>
                ),
            },
            {
                path: 'users',
                element: (
                    <UserContextProvider>
                        <UserList />
                    </UserContextProvider>
                ),
            },
        ],
    },
])

export default router
