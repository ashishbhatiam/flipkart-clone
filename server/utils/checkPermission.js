const { UnauthenticatedError } = require('../errors')
const { admin_role } = require('./constants')

const checkPermission = (requestUser, resourceUserId) => {
  if (requestUser.role === admin_role) return
  if (requestUser._id === resourceUserId.toString()) return
  throw new UnauthenticatedError('Unauthorized to access this route.')
}

const checkAdminPermissionBoolean = requestUser => {
  if (requestUser.role === admin_role) return true
  return false
}

module.exports = {
  checkPermission,
  checkAdminPermissionBoolean
}
