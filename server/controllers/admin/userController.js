const User = require('../../models/User')
const { StatusCodes } = require('http-status-codes')
const { createJWTtoken, createTokenUser, createUserData } = require('../../utils')
const { admin_role } = require('../../utils')

const getCurrentAdmin = async (req, res) => {
  const { _id } = req.user
  const user = await User.findOne({ _id: _id, role: admin_role }).select(
    '-password'
  )
  const token = createJWTtoken(createTokenUser(user))
  res.status(StatusCodes.OK).json({ user: createUserData(user), token })
}

module.exports = {
  getCurrentAdmin
}
