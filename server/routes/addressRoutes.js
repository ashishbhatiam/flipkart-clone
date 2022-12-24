const express = require('express')
const router = express.Router()

const {
  getAllAddress,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  createAddress
} = require('../controllers/addressController')
const { authenticationMiddleware } = require('../middleware/authentication')

router
  .route('/')
  .get(authenticationMiddleware, getAllAddress)
  .post(authenticationMiddleware, createAddress)
router
  .route('/:id')
  .get(authenticationMiddleware, getSingleAddress)
  .patch(authenticationMiddleware, updateAddress)
  .delete(authenticationMiddleware, deleteAddress)

module.exports = router
