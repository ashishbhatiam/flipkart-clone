const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema({
  img: {
    type: String
  },
  link: {
    type: String
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
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
      required: true,
      unique: true
    },
    banners: {
      img: {
        type: String,
        required: [true, 'please provide Banner image']
      },
      link: {
        type: String
      }
    },
    products: [ProductsSchema],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Banner', BannerSchema)
