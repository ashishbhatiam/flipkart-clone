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

const OrderSchema = new mongoose.Schema(
  {
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
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// // Virtuals
OrderSchema.virtual('orderStatus', {
  ref: 'Orderstatus',
  localField: '_id',
  foreignField: 'order',
  justOne: false
})

OrderSchema.pre('save', async function (next) {
  if (this._id) {
    await this.model('Orderstatus').create({ order: this._id })
    await this.model('Cart').deleteMany({ user: this.user })
  }
  next()
})

module.exports = mongoose.model('Order', OrderSchema)
