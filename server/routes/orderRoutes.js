const express = require('express')
const router = express.Router()
const {
  createOrder,
  updateOrderStatus,
  getAllOrder,
  getSingleOrder
} = require('../controllers/orderController')
const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')

router
  .route('/')
  .post(authenticationMiddleware, createOrder)
  .get(authenticationMiddleware, getAllOrder)
router
  .route('/:id')
  .patch(
    authenticationMiddleware,
    authorizePermissonsMiddleware('admin'),
    updateOrderStatus
  )
  .get(authenticationMiddleware, getSingleOrder)

module.exports = router
