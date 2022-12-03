const User = require('../../models/User')
const { StatusCodes } = require('http-status-codes')
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError
} = require('../../errors')
const {
  createJWTtoken,
  createTokenUser,
  createUserData
} = require('../../utils')
const { admin_role, checkPermission } = require('../../utils')

const register = async (req, res) => {
  const { firstName, lastName, password, email, userName } = req.body
  const isAdminEmailExists = await User.findOne({ email })
  if (isAdminEmailExists) {
    throw new BadRequestError(
      'Email already exists, Please try a different email.'
    )
  }
  const user = await User.create({
    firstName,
    lastName,
    password,
    email,
    userName,
    role: admin_role
  })
  const token = createJWTtoken(createTokenUser(user))
  res.status(StatusCodes.CREATED).json({ user: createUserData(user), token })
}

const login = async (req, res) => {
  const { password, email } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('You are not registered with us, Please sign up.')
  }
  const isPasswordMatch = await user.comparePassword(password)
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('Incorrect credentials')
  }
  checkPermission(user)
  res.status(StatusCodes.OK).json({
    user: createUserData(user),
    token: createJWTtoken(createTokenUser(user))
  })
}

module.exports = {
  register,
  login
}
