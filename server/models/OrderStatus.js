const mongoose = require('mongoose')

const OrderStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: {
        values: ['ordered', 'packed', 'cancelled', 'shipped', 'delivered']
      },
      default: 'ordered'
    },
    completed: {
      type: Boolean,
      default: false
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: 'Order',
      required: true
    }
  },
  { timestamps: true }
)

OrderStatusSchema.index({ status: 1, order: 1 }, { unique: true })

module.exports = mongoose.model('Orderstatus', OrderStatusSchema)
