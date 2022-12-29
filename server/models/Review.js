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
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot be more than 5'],
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

ReviewSchema.statics.calculateReview = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: mongoose.Types.ObjectId(productId)
      }
    },
    {
      $group: {
        _id: null,
        numOfReviews: {
          $sum: 1
        },
        averageRating: {
          $avg: '$rating'
        }
      }
    }
  ])
  for (const { numOfReviews, averageRating } of result) {
    await this.model('Product').findByIdAndUpdate(
      { _id: productId },
      { numOfReviews, averageRating }
    )
  }
}

ReviewSchema.post('save', async function (next) {
  await this.constructor.calculateReview(this.product)
})

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema)
