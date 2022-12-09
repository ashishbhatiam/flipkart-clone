const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { createJWTtoken, createTokenUser, createUserData } = require('../utils')

const getCurrentUser = async (req, res) => {
  const { _id } = req.user
  const user = await User.findOne({ _id: _id }).select('-password')
  const token = createJWTtoken(createTokenUser(user))
  res.status(StatusCodes.OK).json({ user: createUserData(user), token })
}

module.exports = {
  getCurrentUser
}
