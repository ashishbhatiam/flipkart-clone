const jwt = require('jsonwebtoken')
const { UnauthenticatedError, UnauthorizedError } = require('../errors')
const { createTokenUser, admin_role } = require('../utils')

const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication failed.')
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = createTokenUser(decoded)
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication failed.')
  }
}

const authorizePermissonsMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route.')
    }
    next()
  }
}

module.exports = {
  authenticationMiddleware,
  authorizePermissonsMiddleware
}
