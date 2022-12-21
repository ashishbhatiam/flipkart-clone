const express = require('express')
const router = express.Router()

const {
  getAllCategories,
  createCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')
const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role, uploadImage } = require('../utils')

router
  .route('/')
  .get(getAllCategories)
  .post(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    uploadImage.single('img'),
    createCategory
  )

router
  .route('/:id')
  .get(getSingleCategory)
  .patch(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    uploadImage.single('img'),
    updateCategory
  )
  .delete(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    deleteCategory
  )

module.exports = router
