import { Modal, Form, Input, Typography } from 'antd'
import { useUserContext } from '@/contexts/UserContext'

const { Text } = Typography

const ChangePasswordModal = () => {
    const {
        isPasswordModalOpen,
        closePasswordModal,
        passwordTargetUser,
        handleChangePassword,
        actionLoading,
    } = useUserContext()
    const [form] = Form.useForm()

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            await handleChangePassword(passwordTargetUser.id, values.newPassword)
            form.resetFields()
        } catch {
            // validation errors handled by antd
        }
    }

    const handleCancel = () => {
        form.resetFields()
        closePasswordModal()
    }

    return (
        <Modal
            title="Change Password"
            open={isPasswordModalOpen}
            onCancel={handleCancel}
            onOk={handleSubmit}
            okText="Change Password"
            confirmLoading={actionLoading}
            width={460}
            destroyOnHidden
        >
            <div style={{ marginBottom: 16, marginTop: 8 }}>
                <Text type="secondary">
                    Changing password for <Text strong>{passwordTargetUser?.email}</Text>
                </Text>
            </div>

            <Form form={form} layout="vertical" requiredMark={false}>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                        { required: true, message: 'New password is required' },
                        { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Please confirm the password' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error('Passwords do not match'))
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangePasswordModal
