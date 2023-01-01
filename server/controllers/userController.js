const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  createJWTtoken,
  createTokenUser,
  createUserData,
  checkPermission,
  uploadFileCloudinary
} = require('../utils')
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError
} = require('../errors')

const getCurrentUser = async (req, res) => {
  const { _id } = req.user
  const user = await User.findOne({ _id: _id }).select('-password')
  const token = createJWTtoken(createTokenUser(user))
  res.status(StatusCodes.OK).json({ user: createUserData(user), token })
}

const getAllUser = async (req, res) => {
  const users = await User.find({}).sort('-createdAt').select('-password')
  res.status(StatusCodes.OK).json({ count: users.length, users })
}

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params
  const user = await User.findOne({ _id: userId }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user found with id: ${userId}`)
  }
  checkPermission(req.user, user._id)
  res.status(StatusCodes.OK).json(user)
}

const updateUser = async (req, res) => {
  const { id: userId } = req.params
  const bodyObj = ({ userName, email, contactNumber, firstName, lastName } =
    req.body)
  const profilePicture = req.file
  if (profilePicture) {
    const result = await uploadFileCloudinary(profilePicture)
    bodyObj['profilePicture'] = result.url
  }
  let user = await User.findOne({ _id: userId }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user found with id: ${userId}`)
  }
  checkPermission(req.user, user._id)

  user = Object.assign(user, bodyObj)
  const updatedUser = await user.save()
  res.status(StatusCodes.OK).json(updatedUser)
}

const updateUserPassword = async (req, res) => {
  const { old_password, new_password } = req.body
  if (!old_password || !new_password) {
    throw new BadRequestError('Please provide old and new password.')
  }
  const { _id: userId } = req.user
  const user = await User.findOne({ _id: userId })
  const isPasswordMatch = await user.comparePassword(old_password)
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('Incorrect credentails.')
  }
  user.password = new_password
  await user.save()
  res.status(StatusCodes.OK).end()
}

const deleteUser = async (req, res) => {
  const { id: userId } = req.params
  const user = await User.findOne({ _id: userId }).select('-password')
  if (!user) {
    throw new NotFoundError(`No user found with id: ${userId}`)
  }
  checkPermission(req.user, user._id)
  await user.remove()
  res.status(StatusCodes.OK).end()
}

module.exports = {
  getCurrentUser,
  getAllUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
  deleteUser
}
