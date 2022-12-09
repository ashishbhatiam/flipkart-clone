const express = require('express')
const router = express.Router()

const { getCurrentUser } = require('../controllers/userController')
const { authenticationMiddleware } = require('../middleware/authentication')

router.get('/me', authenticationMiddleware, getCurrentUser)

module.exports = router
