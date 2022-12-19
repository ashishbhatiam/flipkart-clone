const multer = require('multer')
const path = require('path')
const { BadRequestError } = require('../errors')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '../tmp/uploads/')
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const checkImageFileType = function (file, cb) {
  const mimeType = file.mimetype.startsWith('image')

  if (mimeType) {
    return cb(null, true)
  } else {
    cb(new BadRequestError('Please upload Image type file only.'))
  }
}

const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkImageFileType(file, cb)
  }
})

module.exports = {
  storage,
  checkImageFileType,
  uploadImage
}
