const mongoose = require('mongoose')

const ItemsSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  payableAmount: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const OrderStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: {
      values: ['ordered', 'packed', 'cancelled', 'shipped', 'delivered']
    },
    default: 'ordered'
  },
  date: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    requried: true
  },
  address: {
    type: mongoose.Types.ObjectId,
    ref: 'Address',
    requried: true
  },
  total: {
    type: Number,
    requried: true
  },
  items: [ItemsSchema],
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'cancelled', 'refund'],
      message: '{VALUE} is not supported payment status'
    },
    default: 'pending'
  },
  paymentType: {
    type: String,
    enum: {
      values: ['cod', 'card'],
      message: '{VALUE} is not supported payment type'
    },
    default: 'cod'
  },
  orderStatus: [OrderStatusSchema]
})

module.exports = mongoose.model('Order', OrderSchema)
