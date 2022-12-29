const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: {
      type: String,
      trim: true,
      maxLength: [100, 'Title cannot be more than 100 characters']
    },
    comment: {
      type: String,
      trim: true,
      maxLength: [500, 'Comment cannot be more than 500 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide review rating']
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', ReviewSchema)
