const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide address name'],
    trim: true
  },
  mobileNumber: {
    type: Number,
    required: [true, 'Please provide mobile number']
  },
  alternativeNumber: {
    type: Number
  },
  landmark: {
    type: String,
    required: [true, 'Please provide landmark']
  },
  pincode: {
    type: String,
    required: [true, 'Please provide pincode']
  },
  city: {
    type: String,
    required: [true, 'Please provide city']
  },
  state: {
    type: String,
    required: [true, 'Please provide state']
  },
  type: {
    type: String,
    enum: {
      values: ['home', 'work'],
      message: '{VALUE} is not supported address type'
    },
    default: 'home'
  }
})

module.exports = mongoose.model('Address'.AddressSchema)
