import { Row, Col, Card, Statistic, Typography, Table, Tag } from 'antd'
import {
    VideoCameraOutlined,
    UserOutlined,
    PlayCircleOutlined,
    RiseOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const statsData = [
    {
        title: 'Total Movies',
        value: 1284,
        icon: <VideoCameraOutlined />,
        color: '#e50914',
        trend: '+12%',
    },
    {
        title: 'Total Users',
        value: 8432,
        icon: <UserOutlined />,
        color: '#7c3aed',
        trend: '+8%',
    },
    {
        title: 'Active Streams',
        value: 342,
        icon: <PlayCircleOutlined />,
        color: '#2563eb',
        trend: '+24%',
    },
    {
        title: 'Revenue',
        value: 54200,
        prefix: '$',
        icon: <RiseOutlined />,
        color: '#059669',
        trend: '+18%',
    },
]

const recentColumns = [
    {
        title: 'Activity',
        dataIndex: 'activity',
        key: 'activity',
    },
    {
        title: 'User',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
            const colors = { movie: 'red', user: 'purple', system: 'blue' }
            return <Tag color={colors[type] || 'default'}>{type}</Tag>
        },
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (text) => <Text type="secondary">{text}</Text>,
    },
]

const recentData = [
    { key: '1', activity: 'New movie added: "The Matrix 5"', user: 'admin@netfliz.com', type: 'movie', time: '2 min ago' },
    { key: '2', activity: 'User registered', user: 'john@example.com', type: 'user', time: '15 min ago' },
    { key: '3', activity: 'Movie updated: "Inception"', user: 'admin@netfliz.com', type: 'movie', time: '1 hour ago' },
    { key: '4', activity: 'System backup completed', user: 'system', type: 'system', time: '3 hours ago' },
    { key: '5', activity: 'New user registered', user: 'jane@example.com', type: 'user', time: '5 hours ago' },
]

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <Title level={3} className="dashboard__title">
                    Dashboard
                </Title>
                <Text type="secondary">Welcome back! Here&apos;s an overview of your platform.</Text>
            </div>

            {/* Stat cards */}
            <Row gutter={[20, 20]} className="dashboard__stats">
                {statsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card className="dashboard__stat-card" hoverable>
                            <div className="dashboard__stat-card-inner">
                                <div>
                                    <Text type="secondary" className="dashboard__stat-label">
                                        {stat.title}
                                    </Text>
                                    <Statistic
                                        value={stat.value}
                                        prefix={stat.prefix}
                                        valueStyle={{ color: '#fafafa', fontSize: 28, fontWeight: 700 }}
                                    />
                                </div>
                                <div
                                    className="dashboard__stat-icon"
                                    style={{ background: `${stat.color}20`, color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="dashboard__stat-trend">
                                <Tag color="success" bordered={false}>
                                    {stat.trend}
                                </Tag>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    vs last month
                                </Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Recent Activity */}
            <Card className="dashboard__recent" title="Recent Activity" style={{ marginTop: 20 }}>
                <Table
                    columns={recentColumns}
                    dataSource={recentData}
                    pagination={false}
                    size="middle"
                />
            </Card>
        </div>
    )
}

export default Dashboard
