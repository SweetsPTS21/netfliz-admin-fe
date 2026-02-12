import { Table, Button, Space, Typography, Input, Tag, Popconfirm, Tooltip } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
} from '@ant-design/icons'
import { useMovieContext } from '@/contexts/MovieContext'
import MovieForm from './MovieForm'

const { Title, Text } = Typography

const MovieList = () => {
    const {
        movies,
        loading,
        deleting,
        pagination,
        setPagination,
        openCreateForm,
        openEditForm,
        deleteMovie,
        refetch,
        filters,
        setFilters,
    } = useMovieContext()

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width: 220,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            width: 80,
            align: 'center',
        },
        {
            title: 'Genre',
            dataIndex: 'genre',
            key: 'genre',
            width: 180,
            ellipsis: true,
            render: (genres) => {
                if (!genres) return '-'
                const list = Array.isArray(genres) ? genres : genres.split(',')
                return list.slice(0, 2).map((g, i) => (
                    <Tag key={i} color="red" bordered={false}>
                        {g.trim()}
                    </Tag>
                ))
            },
        },
        {
            title: 'Director',
            dataIndex: 'director',
            key: 'director',
            ellipsis: true,
            width: 160,
        },
        {
            title: 'Rating',
            dataIndex: 'imdbRating',
            key: 'imdbRating',
            width: 90,
            align: 'center',
            render: (val) =>
                val ? (
                    <Tag color="gold" bordered={false}>
                        ⭐ {val}
                    </Tag>
                ) : (
                    '-'
                ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            align: 'center',
            render: (type) => (
                <Tag color={type === 'movie' ? 'blue' : 'purple'} bordered={false}>
                    {type || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 120,
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
                    <Popconfirm
                        title="Delete movie"
                        description="Are you sure you want to delete this movie?"
                        onConfirm={() => deleteMovie(record.id)}
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                loading={deleting}
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
        setFilters((prev) => ({ ...prev, title: value || undefined }))
        setPagination((prev) => ({ ...prev, page: 1 }))
    }

    return (
        <div className="management-page">
            <div className="management-page__header">
                <div>
                    <Title level={3} className="management-page__title">
                        Movies
                    </Title>
                    <Text type="secondary">Manage your movie catalog</Text>
                </div>
                <Space>
                    <Input.Search
                        placeholder="Search movies…"
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
                        Add Movie
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={movies}
                loading={loading}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}–${range[1]} of ${total} movies`,
                }}
                scroll={{ x: 900 }}
                className="management-table"
            />

            <MovieForm />
        </div>
    )
}

export default MovieList
