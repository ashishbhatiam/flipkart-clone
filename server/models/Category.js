const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      maxLength: 100
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: 'Category'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Category', CategorySchema)
