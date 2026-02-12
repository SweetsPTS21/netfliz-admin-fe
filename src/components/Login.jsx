import { useEffect } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart } from '@/store/actions/login';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, user, error } = useSelector((state) => state.login);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            messageApi.error(error?.message || 'Login failed. Please try again.');
        }
    }, [error, messageApi]);

    const onFinish = (values) => {
        dispatch(
            loginStart({
                email: values.email,
                password: values.password,
                rememberMe: values.remember || false,
            }),
        );
    };

    return (
        <>
            {contextHolder}
            <div className="login-page">
                {/* ===== LEFT: Hero Branding Panel ===== */}
                <div className="login-hero">
                    {/* Floating orbs */}
                    <div className="login-orb login-orb--1" />
                    <div className="login-orb login-orb--2" />
                    <div className="login-orb login-orb--3" />

                    <div className="login-hero__content">
                        {/* Logo */}
                        <div className="login-logo">
                            <div className="login-logo__icon">
                                <svg
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-10 h-10"
                                >
                                    <rect width="40" height="40" rx="10" fill="url(#logo-grad)" />
                                    <path
                                        d="M12 10L18 30L22 18L26 30L32 10"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="logo-grad"
                                            x1="0"
                                            y1="0"
                                            x2="40"
                                            y2="40"
                                        >
                                            <stop stopColor="#e50914" />
                                            <stop offset="1" stopColor="#b20710" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className="login-logo__text">Netfliz</span>
                        </div>

                        {/* Hero text */}
                        <h1 className="login-hero__title">
                            Welcome to
                            <br />
                            <span className="login-hero__title--accent">Admin Panel</span>
                        </h1>
                        <p className="login-hero__subtitle">
                            Manage your streaming platform with powerful tools.
                            <br />
                            Analytics, content, users — all in one place.
                        </p>

                        {/* Feature badges */}
                        <div className="login-hero__features">
                            <div className="login-feature-badge">
                                <span className="login-feature-badge__dot" />
                                Real-time Analytics
                            </div>
                            <div className="login-feature-badge">
                                <span className="login-feature-badge__dot" />
                                Content Management
                            </div>
                            <div className="login-feature-badge">
                                <span className="login-feature-badge__dot" />
                                User Administration
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT: Login Form ===== */}
                <div className="login-form-wrapper">
                    <div className="login-card">
                        {/* Mobile logo (only visible < lg) */}
                        <div className="login-card__mobile-logo">
                            <svg
                                viewBox="0 0 40 40"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-9 h-9"
                            >
                                <rect width="40" height="40" rx="10" fill="url(#logo-grad-m)" />
                                <path
                                    d="M12 10L18 30L22 18L26 30L32 10"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <defs>
                                    <linearGradient
                                        id="logo-grad-m"
                                        x1="0"
                                        y1="0"
                                        x2="40"
                                        y2="40"
                                    >
                                        <stop stopColor="#e50914" />
                                        <stop offset="1" stopColor="#b20710" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="login-logo__text">Netfliz</span>
                        </div>

                        <h2 className="login-card__title">Sign in to your account</h2>
                        <p className="login-card__subtitle">
                            Enter your credentials to access the admin dashboard
                        </p>

                        <Form
                            name="login"
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                            requiredMark={false}
                            size="large"
                        >
                            <Form.Item
                                label={<span className="login-label">Email address</span>}
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter your email' },
                                    { type: 'email', message: 'Please enter a valid email' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="login-input-icon" />}
                                    placeholder="admin@netfliz.com"
                                    className="login-input"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="login-label">Password</span>}
                                name="password"
                                rules={[
                                    { required: true, message: 'Please enter your password' },
                                    {
                                        min: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="login-input-icon" />}
                                    placeholder="••••••••"
                                    className="login-input"
                                />
                            </Form.Item>

                            <div className="login-options">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox className="login-checkbox">Remember me</Checkbox>
                                </Form.Item>
                                <a href="#" className="login-forgot">
                                    Forgot password?
                                </a>
                            </div>

                            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    className="login-submit-btn"
                                >
                                    {loading ? 'Signing in…' : 'Sign In'}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="login-card__footer">
                            <span className="login-card__footer-text">
                                Protected by Netfliz Security
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;