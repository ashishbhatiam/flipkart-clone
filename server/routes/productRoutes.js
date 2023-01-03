const express = require('express')
const router = express.Router()

const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} = require('../controllers/productController')

const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role, uploadImage } = require('../utils')

router
  .route('/')
  .get(getAllProduct)
  .post(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    uploadImage.array('images'),
    createProduct
  )

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    uploadImage.array('images'),
    updateProduct
  )
  .delete(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    deleteProduct
  )

router
  .route('/:id/remove-productimage')
  .delete(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    deleteProductImage
  )

module.exports = router
