const express = require('express')
const router = express.Router()
const {
  getCartItems,
  toggleCartItem,
  updateCartQuantity
} = require('../controllers/cartController')
const { authenticationMiddleware } = require('../middleware/authentication')

router.route('/').get(authenticationMiddleware, getCartItems)
router
  .route('/:id')
  .post(authenticationMiddleware, toggleCartItem)
  .patch(authenticationMiddleware, updateCartQuantity)

module.exports = router
