import cloudinary from 'cloudinary'

cloudinary.v2.config({
    secure: true,
})

const uploadImage = (file) => {
    return cloudinary.v2.uploader.upload(file, {
        resource_type: 'image',
    })
}

const destroyImage = (publicId) => {
    return cloudinary.v2.uploader.destroy(publicId, {
        resource_type: 'image',
    })
}

export { uploadImage, destroyImage }
