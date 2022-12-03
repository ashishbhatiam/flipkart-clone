const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first name is required'],
      trim: true,
      maxLength: 20
    },
    lastName: {
      type: String,
      required: [true, 'last name is required'],
      trim: true,
      maxLength: 20
    },
    fullName: {
      type: String
    },
    userName: {
      type: String,
      required: [true, 'username is required'],
      trim: true,
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'password is required']
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
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)
