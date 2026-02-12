import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { message } from 'antd'
import {
    GET_MOVIES_BY_FILTER,
    CREATE_MOVIE,
    UPDATE_MOVIE,
    DELETE_MOVIE,
} from '@/graphql/movie'
import { getMovieMetadata } from '@/api/config'

const MovieContext = createContext({})

export const useMovieContext = () => useContext(MovieContext)

const MovieContextProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage()
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })
    const [filters, setFilters] = useState({})
    const [editingMovie, setEditingMovie] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [metadata, setMetadata] = useState({})

    // Fetch metadata on mount
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const { data } = await getMovieMetadata()
                setMetadata(data)
            } catch (error) {
                console.error('Failed to fetch movie metadata:', error)
            }
        }
        fetchMetadata()
    }, [])

    // Fetch movies
    const { data, loading, refetch } = useQuery(GET_MOVIES_BY_FILTER, {
        variables: {
            request: {
                page: pagination.page,
                pageSize: pagination.pageSize,
                ...filters,
            },
        },
        fetchPolicy: 'cache-and-network',
    })

    const movieData = data?.getMoviesByFilter

    // Mutations
    const [createMovieMutation, { loading: creating }] = useMutation(CREATE_MOVIE)
    const [updateMovieMutation, { loading: updating }] = useMutation(UPDATE_MOVIE)
    const [deleteMovieMutation, { loading: deleting }] = useMutation(DELETE_MOVIE)

    const createMovie = useCallback(
        async (movie) => {
            try {
                await createMovieMutation({ variables: { movie } })
                messageApi.success('Movie created successfully!')
                setIsFormOpen(false)
                refetch()
            } catch (error) {
                messageApi.error(error?.message || 'Failed to create movie')
            }
        },
        [createMovieMutation, messageApi, refetch],
    )

    const updateMovie = useCallback(
        async (id, movie) => {
            try {
                await updateMovieMutation({ variables: { id, movie } })
                messageApi.success('Movie updated successfully!')
                setIsFormOpen(false)
                setEditingMovie(null)
                refetch()
            } catch (error) {
                messageApi.error(error?.message || 'Failed to update movie')
            }
        },
        [updateMovieMutation, messageApi, refetch],
    )

    const deleteMovie = useCallback(
        async (id) => {
            try {
                await deleteMovieMutation({ variables: { id } })
                messageApi.success('Movie deleted successfully!')
                refetch()
            } catch (error) {
                messageApi.error(error?.message || 'Failed to delete movie')
            }
        },
        [deleteMovieMutation, messageApi, refetch],
    )

    const openCreateForm = useCallback(() => {
        setEditingMovie(null)
        setIsFormOpen(true)
    }, [])

    const openEditForm = useCallback((movie) => {
        setEditingMovie(movie)
        setIsFormOpen(true)
    }, [])

    const closeForm = useCallback(() => {
        setEditingMovie(null)
        setIsFormOpen(false)
    }, [])

    const contextValue = useMemo(
        () => ({
            movies: movieData?.items || [],
            loading,
            creating,
            updating,
            deleting,
            metadata,
            pagination: {
                current: movieData?.page || pagination.page,
                pageSize: movieData?.pageSize || pagination.pageSize,
                total: movieData?.total || 0,
            },
            setPagination,
            filters,
            setFilters,
            editingMovie,
            isFormOpen,
            openCreateForm,
            openEditForm,
            closeForm,
            createMovie,
            updateMovie,
            deleteMovie,
            refetch,
        }),
        [
            movieData, loading, creating, updating, deleting, metadata,
            pagination, filters, editingMovie, isFormOpen,
            openCreateForm, openEditForm, closeForm,
            createMovie, updateMovie, deleteMovie, refetch,
        ],
    )

    return (
        <MovieContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </MovieContext.Provider>
    )
}

export default MovieContextProvider
