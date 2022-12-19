const mongoose = require('mongoose')
const { BadRequestError } = require('../errors')

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'quantity is beneath the limit 1'],
    max: [100, 'quantity exceeds the limit of 100']
  }
})

CartSchema.pre('save', async function (next) {
  const product = await this.model('Product').findOne({ _id: this.product })
  if (product.inventory < this.quantity) {
    throw new BadRequestError(
      'Quantity exceeds the limit of available inventory.'
    )
  }
  next()
})

module.exports = mongoose.model('Cart', CartSchema)
