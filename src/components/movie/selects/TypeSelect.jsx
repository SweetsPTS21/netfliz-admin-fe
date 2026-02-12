import { Form, Select } from 'antd'
import { useMovieContext } from '@/contexts/MovieContext'

export const TypeSelect = ({ value, onChange }) => {
    const { metadata } = useMovieContext()

    const options = metadata?.types?.map((type) => ({
        value: type?.value,
        label: type?.description,
    }))

    return (
        <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Type is required' }]}
        >
            <Select
                placeholder="Select type"
                value={value}
                options={options}
                onChange={onChange}
            />
        </Form.Item>
    )
}
