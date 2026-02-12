import { useEffect, useState } from 'react'
import { Form, Image, message, Typography, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { getBase64 } from '@/utils/file'
import { IMAGE_TYPE } from '@/constants/imageType'
import { uploadPoster } from '@/api/upload'

const { Text } = Typography

const PosterUpload = ({ form, maxFileSize = 5 }) => {
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [fileList, setFileList] = useState([])

    const images = form.getFieldValue('posters') || []

    useEffect(() => {
        if (Array.isArray(images) && images.length > 0) {
            const poster = images.find((item) => item.type === IMAGE_TYPE.POSTER)
            if (poster) {
                setFileList([
                    {
                        uid: poster.id || '-1',
                        name: 'Poster',
                        status: 'done',
                        url: poster.url,
                    },
                ])
            }
        }
    }, [images])

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewOpen(true)
    }

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(
            newFileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url
                }
                return file
            }),
        )
    }

    const validateFile = (file) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
            message.error('You can only upload image files!')
            return false
        }
        const validSize = file.size / 1024 / 1024 < maxFileSize
        if (!validSize) {
            message.error(`Image must be smaller than ${maxFileSize}MB!`)
            return false
        }
        return true
    }

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if (!file) return

        if (!validateFile(file)) {
            setFileList((prev) => prev.filter((item) => item.uid !== file.uid))
            return
        }

        const formData = new FormData()
        formData.append('file', file)

        try {
            const { success, data } = await uploadPoster(formData)
            if (success && Array.isArray(data)) {
                const mappedImages = data.map((item) => {
                    let type
                    switch (item?.category) {
                        case '320':
                            type = IMAGE_TYPE.THUMBNAIL
                            break
                        case '640':
                            type = IMAGE_TYPE.POSTER
                            break
                        case '1024':
                            type = IMAGE_TYPE.LANDSCAPE
                            break
                        case 'original':
                            type = IMAGE_TYPE.BACKDROP
                            break
                        default:
                            type = IMAGE_TYPE.POSTER
                    }
                    return {
                        id: item?.id,
                        type,
                        url: item?.url,
                        format: item?.format,
                        name: item?.name,
                    }
                })
                form.setFieldValue('posters', mappedImages)
                const poster = mappedImages.find((i) => i.type === IMAGE_TYPE.POSTER)
                onSuccess({ url: poster?.url }, file)
            }
        } catch (err) {
            message.error(err?.response?.data?.message || 'Upload failed')
            onError(err)
        }
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    )

    return (
        <div>
            <Form.Item name="posters">
                <ImgCrop rotationSlider quality={1} aspect={2 / 3}>
                    <Upload
                        customRequest={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                </ImgCrop>
                <Text type="secondary">Poster (2:3 ratio, max {maxFileSize}MB)</Text>
            </Form.Item>
            {previewImage && (
                <Image
                    styles={{ root: { display: 'none' } }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </div>
    )
}

export default PosterUpload
