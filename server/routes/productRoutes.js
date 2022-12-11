const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')

const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController')

const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role } = require('../utils')
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

const checkFileType = function (file, cb) {
  const mimeType = file.mimetype.startsWith('image')

  if (mimeType) {
    return cb(null, true)
  } else {
    cb(new BadRequestError('Please upload Image type file only.'))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
})

router
  .route('/')
  .get(getAllProduct)
  .post(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    upload.array('images'),
    createProduct
  )

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    updateProduct
  )
  .delete(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    deleteProduct
  )

module.exports = router
