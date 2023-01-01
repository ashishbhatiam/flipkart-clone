const express = require('express')
const router = express.Router()

const {
  getCurrentUser,
  getAllUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
  deleteUser
} = require('../controllers/userController')
const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role, uploadImage } = require('../utils')

router.get(
  '/',
  authenticationMiddleware,
  authorizePermissonsMiddleware(admin_role),
  getAllUser
)
router.get('/me', authenticationMiddleware, getCurrentUser)
router.patch('/update-password', authenticationMiddleware, updateUserPassword)
router
  .route('/:id')
  .get(authenticationMiddleware, getSingleUser)
  .patch(authenticationMiddleware, uploadImage.single('profilePicture'), updateUser)
  .delete(authenticationMiddleware, deleteUser)

module.exports = router
