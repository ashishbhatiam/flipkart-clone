const express = require('express')
const router = express.Router()
const {
  getCartItems,
  toggleCartItem,
  updateCartQuantity
} = require('../controllers/cartController')

router.route('/').get(getCartItems)
router.route('/:id').post(toggleCartItem).patch(updateCartQuantity)

module.exports = router
