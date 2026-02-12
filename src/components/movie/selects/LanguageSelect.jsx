import { Form, Select } from 'antd'
import { useMovieContext } from '@/contexts/MovieContext'

export const LanguageSelect = ({ value }) => {
    const { metadata } = useMovieContext()

    const options = metadata?.languages?.map((language) => ({
        value: language?.slug,
        label: language?.description,
    }))

    return (
        <Form.Item
            label="Languages"
            name="languages"
            rules={[{ required: true, message: 'Language is required' }]}
        >
            <Select
                mode="multiple"
                placeholder="Select languages"
                value={value}
                options={options}
            />
        </Form.Item>
    )
}
