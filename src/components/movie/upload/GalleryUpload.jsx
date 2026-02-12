import { useEffect, useState } from 'react'
import { Form, Image, message, Typography, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { getBase64 } from '@/utils/file'
import { IMAGE_TYPE } from '@/constants/imageType'
import { uploadGallery } from '@/api/upload'

const { Text } = Typography

const GalleryUpload = ({ form, maxCount = 10, maxFileSize = 5 }) => {
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [fileList, setFileList] = useState([])

    const images = form.getFieldValue('gallery') || []

    useEffect(() => {
        if (Array.isArray(images) && images.length > 0) {
            setFileList(
                images.map((image) => ({
                    uid: image?.id || String(Math.random()),
                    name: 'Gallery',
                    status: 'done',
                    url: image?.url,
                })),
            )
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
            const { success, data } = await uploadGallery(formData)
            if (success && data) {
                const currentImages = form.getFieldValue('gallery') || []
                form.setFieldValue('gallery', [
                    ...currentImages,
                    {
                        id: data?.id,
                        type: IMAGE_TYPE.GALLERY,
                        url: data?.url,
                    },
                ])
                onSuccess({ url: data?.url }, file)
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
            <Form.Item name="gallery">
                <ImgCrop rotationSlider quality={1} aspect={16 / 9}>
                    <Upload
                        customRequest={handleUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length >= maxCount ? null : uploadButton}
                    </Upload>
                </ImgCrop>
                <Text type="secondary">Gallery (16:9 ratio, max {maxCount} images, {maxFileSize}MB each)</Text>
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

export default GalleryUpload
