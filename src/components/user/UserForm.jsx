import { useEffect } from 'react'
import { Modal, Form, Input, Select, Row, Col } from 'antd'
import { useUserContext } from '@/contexts/UserContext'

const UserForm = () => {
    const { isFormOpen, closeForm, editingUser, createUser, updateUser, creating, updating } =
        useUserContext()
    const [form] = Form.useForm()

    const isEditing = !!editingUser

    useEffect(() => {
        if (isFormOpen && editingUser) {
            form.setFieldsValue(editingUser)
        } else if (isFormOpen) {
            form.resetFields()
        }
    }, [isFormOpen, editingUser, form])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            if (isEditing) {
                await updateUser(editingUser.id, values)
            } else {
                await createUser(values)
            }
        } catch {
            // validation errors handled by antd
        }
    }

    return (
        <Modal
            title={isEditing ? 'Edit User' : 'Add New User'}
            open={isFormOpen}
            onCancel={closeForm}
            onOk={handleSubmit}
            okText={isEditing ? 'Update' : 'Create'}
            confirmLoading={creating || updating}
            width={600}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Email is required' },
                        { type: 'email', message: 'Please enter a valid email' },
                    ]}
                >
                    <Input placeholder="user@example.com" disabled={isEditing} />
                </Form.Item>

                {!isEditing && (
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Password is required' },
                            { min: 6, message: 'Password must be at least 6 characters' },
                        ]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>
                )}

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[{ required: true, message: 'First name is required' }]}
                        >
                            <Input placeholder="First name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[{ required: true, message: 'Last name is required' }]}
                        >
                            <Input placeholder="Last name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="phone" label="Phone">
                    <Input placeholder="+84 123 456 789" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                            <Select placeholder="Select role">
                                <Select.Option value="USER">User</Select.Option>
                                <Select.Option value="MODERATOR">Moderator</Select.Option>
                                <Select.Option value="ADMIN">Admin</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select placeholder="Select status">
                                <Select.Option value="ACTIVE">Active</Select.Option>
                                <Select.Option value="INACTIVE">Inactive</Select.Option>
                                <Select.Option value="BANNED">Banned</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UserForm
