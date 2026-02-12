import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { message } from 'antd'
import {
    GET_ALL_USERS,
    CREATE_USER,
    UPDATE_USER_BY_ID,
} from '@/graphql/user'
import { changeUserPassword, disableUser, deleteUserApi } from '@/api/user'

const UserContext = createContext({})

export const useUserContext = () => useContext(UserContext)

const UserContextProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage()
    const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })
    const [filters, setFilters] = useState({})
    const [editingUser, setEditingUser] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [passwordTargetUser, setPasswordTargetUser] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    // Fetch users
    const { data, loading, refetch } = useQuery(GET_ALL_USERS, {
        variables: {
            request: {
                page: pagination.page,
                pageSize: pagination.pageSize,
            }
        },
        fetchPolicy: 'cache-and-network',
    })

    const userData = data?.getAllUser

    // GraphQL Mutations
    const [createUserMutation, { loading: creating }] = useMutation(CREATE_USER)
    const [updateUserMutation, { loading: updating }] = useMutation(UPDATE_USER_BY_ID)

    const createUser = useCallback(
        async (user) => {
            try {
                await createUserMutation({ variables: { user } })
                messageApi.success('User created successfully!')
                setIsFormOpen(false)
                refetch()
            } catch (error) {
                messageApi.error(error?.message || 'Failed to create user')
            }
        },
        [createUserMutation, messageApi, refetch],
    )

    const updateUser = useCallback(
        async (id, user) => {
            try {
                await updateUserMutation({ variables: { id, user } })
                messageApi.success('User updated successfully!')
                setIsFormOpen(false)
                setEditingUser(null)
                refetch()
            } catch (error) {
                messageApi.error(error?.message || 'Failed to update user')
            }
        },
        [updateUserMutation, messageApi, refetch],
    )

    // REST API actions
    const handleChangePassword = useCallback(
        async (id, newPassword) => {
            try {
                setActionLoading(true)
                await changeUserPassword(id, newPassword)
                messageApi.success('Password changed successfully!')
                setIsPasswordModalOpen(false)
                setPasswordTargetUser(null)
            } catch (error) {
                messageApi.error(error?.response?.data?.message || error?.message || 'Failed to change password')
            } finally {
                setActionLoading(false)
            }
        },
        [messageApi],
    )

    const handleDisableUser = useCallback(
        async (id) => {
            try {
                setActionLoading(true)
                await disableUser(id)
                messageApi.success('User status updated successfully!')
                refetch()
            } catch (error) {
                messageApi.error(error?.response?.data?.message || error?.message || 'Failed to update user status')
            } finally {
                setActionLoading(false)
            }
        },
        [messageApi, refetch],
    )

    const handleDeleteUser = useCallback(
        async (id) => {
            try {
                setActionLoading(true)
                await deleteUserApi(id)
                messageApi.success('User deleted successfully!')
                refetch()
            } catch (error) {
                messageApi.error(error?.response?.data?.message || error?.message || 'Failed to delete user')
            } finally {
                setActionLoading(false)
            }
        },
        [messageApi, refetch],
    )

    // Form helpers
    const openCreateForm = useCallback(() => {
        setEditingUser(null)
        setIsFormOpen(true)
    }, [])

    const openEditForm = useCallback((user) => {
        setEditingUser(user)
        setIsFormOpen(true)
    }, [])

    const closeForm = useCallback(() => {
        setEditingUser(null)
        setIsFormOpen(false)
    }, [])

    const openPasswordModal = useCallback((user) => {
        setPasswordTargetUser(user)
        setIsPasswordModalOpen(true)
    }, [])

    const closePasswordModal = useCallback(() => {
        setPasswordTargetUser(null)
        setIsPasswordModalOpen(false)
    }, [])

    const contextValue = useMemo(
        () => ({
            users: userData?.items || [],
            loading,
            creating,
            updating,
            actionLoading,
            pagination: {
                current: userData?.page || pagination.page,
                pageSize: userData?.pageSize || pagination.pageSize,
                total: userData?.total || 0,
            },
            setPagination,
            filters,
            setFilters,
            editingUser,
            isFormOpen,
            openCreateForm,
            openEditForm,
            closeForm,
            createUser,
            updateUser,
            handleChangePassword,
            handleDisableUser,
            handleDeleteUser,
            isPasswordModalOpen,
            passwordTargetUser,
            openPasswordModal,
            closePasswordModal,
            refetch,
        }),
        [
            userData, loading, creating, updating, actionLoading,
            pagination, filters, editingUser, isFormOpen,
            openCreateForm, openEditForm, closeForm,
            createUser, updateUser,
            handleChangePassword, handleDisableUser, handleDeleteUser,
            isPasswordModalOpen, passwordTargetUser,
            openPasswordModal, closePasswordModal, refetch,
        ],
    )

    return (
        <UserContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider
