import { Form, Select } from 'antd'
import { useMovieContext } from '@/contexts/MovieContext'

export const GenreSelect = ({ value }) => {
    const { metadata } = useMovieContext()

    const options = metadata?.genres?.map((genre) => ({
        value: genre?.slug,
        label: genre?.description,
    }))

    return (
        <Form.Item
            label="Genre"
            name="genre"
            rules={[{ required: true, message: 'Genre is required' }]}
        >
            <Select
                mode="multiple"
                placeholder="Select genres"
                value={value}
                options={options}
            />
        </Form.Item>
    )
}
