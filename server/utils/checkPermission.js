const { UnauthenticatedError } = require('../errors')
const { admin_role } = require('./constants')

const checkPermission = (requestUser) => {
  if (requestUser.role === admin_role) return
  throw new UnauthenticatedError('Unauthorized to access this route.')
}

module.exports = checkPermission
