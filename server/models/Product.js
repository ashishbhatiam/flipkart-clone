const mongoose = require('mongoose')

const SingleProductImageSchema = mongoose.Schema({
  img: {
    type: String
  },
  name: {
    type: String
  },
  size: {
    type: Number
  }
})

const imageLength = val => {
  return val.length
}

const imageLimit = val => {
  return val.length <= 10
}

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      maxLength: 150
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price']
    },
    description: {
      type: String,
      required: [true, 'Please provide product descripion'],
      maxLength: 1500
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productImages: {
      type: [SingleProductImageSchema],
      validate: [
        {
          validator: imageLength,
          message: 'Please provide atleast one product image.'
        },
        {
          validator: imageLimit,
          message: 'maximun 10 product images are allowed.'
        }
      ]
    },
    inventory: {
      type: Number,
      default: 0
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    },
    averageRating: {
      type: Number,
      default: 0,
      max: 5
    },
    numOfReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

ProductSchema.pre('remove', async function (next) {
  if (this._id) {
    await this.model('Review').deleteMany({ product: this._id })
  }
  next()
})

module.exports = mongoose.model('Product', ProductSchema)
