import { useEffect } from 'react'
import { Modal, Form, Input, InputNumber, Row, Col, Divider } from 'antd'
import { useMovieContext } from '@/contexts/MovieContext'
import { RatedSelect } from './selects/RatedSelect'
import { TypeSelect } from './selects/TypeSelect'
import { GenreSelect } from './selects/GenreSelect'
import { LanguageSelect } from './selects/LanguageSelect'
import { CountrySelect } from './selects/CountrySelect'
import PosterUpload from './upload/PosterUpload'
import GalleryUpload from './upload/GalleryUpload'

const { TextArea } = Input

const MovieForm = () => {
    const { isFormOpen, closeForm, editingMovie, createMovie, updateMovie, creating, updating } =
        useMovieContext()
    const [form] = Form.useForm()

    const isEditing = !!editingMovie

    useEffect(() => {
        if (isFormOpen && editingMovie) {
            form.setFieldsValue({
                ...editingMovie,
                genre: editingMovie.genre
                    ? Array.isArray(editingMovie.genre)
                        ? editingMovie.genre
                        : editingMovie.genre.split(',').map((g) => g.trim())
                    : [],
                languages: editingMovie.languages
                    ? Array.isArray(editingMovie.languages)
                        ? editingMovie.languages
                        : editingMovie.languages.split(',').map((l) => l.trim())
                    : [],
                countries: editingMovie.countries
                    ? Array.isArray(editingMovie.countries)
                        ? editingMovie.countries
                        : editingMovie.countries.split(',').map((c) => c.trim())
                    : [],
            })
        } else if (isFormOpen) {
            form.resetFields()
        }
    }, [isFormOpen, editingMovie, form])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            const { posters, gallery, ...rest } = values
            const images = [
                ...(Array.isArray(posters) ? posters : []),
                ...(Array.isArray(gallery) ? gallery : []),
            ]
            const movieInput = {
                ...rest,
                images,
            }

            if (isEditing) {
                await updateMovie(editingMovie.id, movieInput)
            } else {
                await createMovie(movieInput)
            }
        } catch {
            // validation errors handled by antd
        }
    }

    return (
        <Modal
            title={isEditing ? 'Edit Movie' : 'Add New Movie'}
            open={isFormOpen}
            onCancel={closeForm}
            onOk={handleSubmit}
            okText={isEditing ? 'Update' : 'Create'}
            confirmLoading={creating || updating}
            width={720}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
                <Row gutter={16}>
                    <Col span={16}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'Title is required' }]}
                        >
                            <Input placeholder="Movie title" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="year" label="Year">
                            <InputNumber
                                placeholder="2024"
                                min={1900}
                                max={2100}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <RatedSelect />
                    </Col>
                    <Col span={8}>
                        <Form.Item name="runtime" label="Runtime">
                            <Input placeholder="148 min" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <TypeSelect />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="director" label="Director">
                            <Input placeholder="Director name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="writer" label="Writer">
                            <Input placeholder="Writer name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="actors" label="Actors">
                    <Input placeholder="Actor 1, Actor 2, …" />
                </Form.Item>

                <GenreSelect />

                <Form.Item name="plot" label="Plot">
                    <TextArea rows={3} placeholder="Movie plot description…" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <LanguageSelect />
                    </Col>
                    <Col span={12}>
                        <CountrySelect />
                    </Col>
                </Row>

                <Divider>Images</Divider>

                <Row gutter={16}>
                    <Col span={8}>
                        <PosterUpload form={form} />
                    </Col>
                    <Col span={16}>
                        <GalleryUpload form={form} />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MovieForm
