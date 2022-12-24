const mongoose = require('mongoose')
const { getHostUrl } = require('../utils')

const ProductsSchema = new mongoose.Schema({
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

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide title'],
      maxLength: 100,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxLength: 500,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    banner: {
      img: {
        type: String,
        required: [true, 'please provide Banner image']
      },
      link: {
        type: String
      }
    },
    products: [ProductsSchema],
    type: {
      type: String,
      enum: {
        values: ['product', 'page'],
        message: '{VALUE} is not supported type'
      },
      default: 'product'
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

BannerSchema.pre('save', function (next) {
  if (this.type === 'page') {
    this.banner.link = `${this.banner.link}?banner=${this._id}?type=${this.type}`
  } else {
    this.banner.link = `${this.banner.link}?banner=${this._id}?type=${this.type}?product=${this.product}`
  }
  next()
})

module.exports = mongoose.model('Banner', BannerSchema)
