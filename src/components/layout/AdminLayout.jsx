import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Typography, Button, Switch } from 'antd'
import {
    DashboardOutlined,
    VideoCameraOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    SettingOutlined,
    SunOutlined,
    MoonOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutStart } from '@/store/actions/login'
import { useTheme } from '@/contexts/ThemeContext'

const { Header, Sider, Content, Footer } = Layout
const { Text } = Typography

const menuItems = [
    {
        key: '/',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
    },
    {
        key: '/movies',
        icon: <VideoCameraOutlined />,
        label: 'Movies',
    },
    {
        key: '/users',
        icon: <UserOutlined />,
        label: 'Users',
    },
]

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { isDark, toggleTheme } = useTheme()

    const handleMenuClick = ({ key }) => {
        navigate(key)
    }

    const handleLogout = () => {
        dispatch(logoutStart())
    }

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout,
        },
    ]

    const selectedKey = (() => {
        const path = location.pathname
        if (path === '/' || path === '/dashboard') return '/'
        const match = menuItems.find((item) => path.startsWith(item.key) && item.key !== '/')
        return match ? match.key : '/'
    })()

    return (
        <Layout className="admin-layout">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="md"
                onBreakpoint={(broken) => setCollapsed(broken)}
                className="admin-sider"
                width={260}
                collapsedWidth={80}
            >
                {/* Logo */}
                <div className="admin-sider__logo">
                    <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="admin-sider__logo-icon"
                    >
                        <rect width="40" height="40" rx="10" fill="url(#sider-logo-grad)" />
                        <path
                            d="M12 10L18 30L22 18L26 30L32 10"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <defs>
                            <linearGradient id="sider-logo-grad" x1="0" y1="0" x2="40" y2="40">
                                <stop stopColor="#e50914" />
                                <stop offset="1" stopColor="#b20710" />
                            </linearGradient>
                        </defs>
                    </svg>
                    {!collapsed && <span className="admin-sider__logo-text">Netfliz</span>}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    className="admin-menu"
                />
            </Sider>

            <Layout>
                <Header className="admin-header">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="admin-header__trigger"
                    />

                    <div className="admin-header__right">
                        <div className="admin-header__theme-toggle">
                            <SunOutlined className={`theme-icon ${!isDark ? 'theme-icon--active' : ''}`} />
                            <Switch
                                checked={isDark}
                                onChange={toggleTheme}
                                size="small"
                                className="theme-switch"
                            />
                            <MoonOutlined className={`theme-icon ${isDark ? 'theme-icon--active' : ''}`} />
                        </div>

                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                            <div className="admin-header__user">
                                <Avatar
                                    size={36}
                                    icon={<UserOutlined />}
                                    className="admin-header__avatar"
                                />
                                {/* visible only on wider screens */}
                                <Text className="admin-header__username">Admin</Text>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                <Content className="admin-content">
                    <Outlet />
                </Content>

                <Footer className="admin-footer">
                    <Text className="admin-footer__text">
                        Netfliz Admin &copy; {new Date().getFullYear()} — Built with ❤️
                    </Text>
                </Footer>
            </Layout>
        </Layout>
    )
}

export default AdminLayout
