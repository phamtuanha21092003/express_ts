import cloudinary from 'cloudinary'

cloudinary.v2.config({
  secure: true,
})

const uploadImage = (file) => {
  cloudinary.v2.uploader.upload(file, {
    resource_type: 'auto',
  })
}

export default uploadImage
