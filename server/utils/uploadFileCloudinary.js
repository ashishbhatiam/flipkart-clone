const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const uploadFileCloudinary = async file => {
  const imagePath = path.join(__dirname, '../tmp/uploads', file.originalname)

  // Upload API call
  const result = await cloudinary.uploader.upload(imagePath, {
    use_filename: true,
    folder:
      process.env.NODE_ENV === 'production'
        ? 'flipkart-clone-api-live'
        : 'flipkart-clone-api-dev'
  })

  fs.unlinkSync(imagePath)
  return result
}

module.exports = {
  uploadFileCloudinary
}
