const mongoose = require('mongoose')

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

module.exports = mongoose.model('Cart', CartSchema)
