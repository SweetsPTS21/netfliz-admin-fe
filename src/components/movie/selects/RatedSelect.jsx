import { Form, Select } from 'antd'
import { useMovieContext } from '@/contexts/MovieContext'

export const RatedSelect = ({ value }) => {
    const { metadata } = useMovieContext()

    const options = metadata?.rated?.map((rated) => ({
        value: rated?.value,
        label: rated?.description,
    }))

    return (
        <Form.Item
            label="Rated"
            name="rated"
            rules={[{ required: true, message: 'Rating is required' }]}
        >
            <Select placeholder="Select rating" value={value} options={options} />
        </Form.Item>
    )
}
