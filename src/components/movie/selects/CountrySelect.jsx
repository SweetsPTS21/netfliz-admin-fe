import { Form, Select } from 'antd'
import { useMovieContext } from '@/contexts/MovieContext'

export const CountrySelect = ({ value }) => {
    const { metadata } = useMovieContext()

    const options = metadata?.countries?.map((item) => ({
        value: item?.value,
        label: item?.description,
    }))

    return (
        <Form.Item
            label="Countries"
            name="countries"
            rules={[{ required: true, message: 'Country is required' }]}
        >
            <Select
                mode="multiple"
                placeholder="Select countries"
                value={value}
                options={options}
            />
        </Form.Item>
    )
}
