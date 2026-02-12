import { Table, Button, Space, Typography, Input, Tag, Popconfirm, Tooltip } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    KeyOutlined,
    StopOutlined,
} from '@ant-design/icons'
import { useUserContext } from '@/contexts/UserContext'
import UserForm from './UserForm'
import ChangePasswordModal from './ChangePasswordModal'

const { Title, Text } = Typography

const UserList = () => {
    const {
        users,
        loading,
        actionLoading,
        pagination,
        setPagination,
        openCreateForm,
        openEditForm,
        handleDisableUser,
        handleDeleteUser,
        openPasswordModal,
        refetch,
        setFilters,
    } = useUserContext()

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            width: 220,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            width: 130,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            width: 130,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
            render: (text) => text || '-',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 100,
            align: 'center',
            render: (role) => {
                const colors = { ADMIN: 'red', USER: 'blue', MODERATOR: 'purple' }
                return (
                    <Tag color={colors[role] || 'default'} bordered={false}>
                        {role || 'N/A'}
                    </Tag>
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            render: (status) => {
                const colorMap = {
                    ACTIVE: 'success',
                    INACTIVE: 'warning',
                    BANNED: 'error',
                    DISABLED: 'default',
                }
                return (
                    <Tag color={colorMap[status] || 'default'} bordered={false}>
                        {status || 'N/A'}
                    </Tag>
                )
            },
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 130,
            render: (date) => {
                if (!date) return '-'
                return new Date(date).toLocaleDateString('vi-VN')
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditForm(record)}
                            className="action-btn action-btn--edit"
                        />
                    </Tooltip>
                    <Tooltip title="Change Password">
                        <Button
                            type="text"
                            icon={<KeyOutlined />}
                            onClick={() => openPasswordModal(record)}
                            className="action-btn action-btn--edit"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Disable user"
                        description={`Are you sure you want to disable ${record.email}?`}
                        onConfirm={() => handleDisableUser(record.id)}
                        okText="Disable"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Disable">
                            <Button
                                type="text"
                                icon={<StopOutlined />}
                                loading={actionLoading}
                                className="action-btn action-btn--warning"
                            />
                        </Tooltip>
                    </Popconfirm>
                    <Popconfirm
                        title="Delete user"
                        description={`Are you sure you want to delete ${record.email}?`}
                        onConfirm={() => handleDeleteUser(record.id)}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                loading={actionLoading}
                                className="action-btn action-btn--delete"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const handleTableChange = (pag) => {
        setPagination({ page: pag.current, pageSize: pag.pageSize })
    }

    const handleSearch = (value) => {
        setFilters((prev) => ({ ...prev, filter: value || undefined }))
        setPagination((prev) => ({ ...prev, page: 1 }))
    }

    return (
        <div className="management-page">
            <div className="management-page__header">
                <div>
                    <Title level={3} className="management-page__title">
                        Users
                    </Title>
                    <Text type="secondary">Manage platform users and permissions</Text>
                </div>
                <Space>
                    <Input.Search
                        placeholder="Search users…"
                        allowClear
                        prefix={<SearchOutlined />}
                        onSearch={handleSearch}
                        className="management-page__search"
                        style={{ width: 260 }}
                    />
                    <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                        Refresh
                    </Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
                        Add User
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                loading={loading}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}–${range[1]} of ${total} users`,
                }}
                scroll={{ x: 1000 }}
                className="management-table"
            />

            <UserForm />
            <ChangePasswordModal />
        </div>
    )
}

export default UserList
