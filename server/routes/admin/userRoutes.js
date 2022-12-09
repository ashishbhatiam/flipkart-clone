const express = require('express')
const router = express.Router()
const { getCurrentAdmin } = require('../../controllers/admin/userController')
const {
  authorizePermissonsMiddleware,
  authenticationMiddleware
} = require('../../middleware/authentication')

router.get(
  '/me',
  authenticationMiddleware,
  authorizePermissonsMiddleware('admin'),
  getCurrentAdmin
)

module.exports = router
