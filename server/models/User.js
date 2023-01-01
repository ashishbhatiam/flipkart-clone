const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const { BadRequestError } = require('../errors')

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
      maxLength: 20
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
      maxLength: 20
    },
    fullName: {
      type: String
    },
    userName: {
      type: String,
      required: [true, 'Please provide username'],
      trim: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide valid email'
      }
    },
    password: {
      type: String,
      required: [true, 'Please provide password']
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not supported status'
      },
      default: 'user'
    },
    contactNumber: {
      type: String
    },
    profilePicture: {
      type: String
    }
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  this.fullName = `${this.firstName} ${this.lastName}`
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
})

UserSchema.post('save', async function (error, doc, next) {
  if (error.code === 11000) {
    next(
      new BadRequestError(
        `username with ${Object.values(error.keyValue)} already exists.`
      )
    )
  } else {
    next(error)
  }
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
