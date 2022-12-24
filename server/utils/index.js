const { createJWTtoken, isTokenValid } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const createUserData = require('./createUserData')
const { user_role, admin_role } = require('./constants')
const {
  checkPermission,
  checkAdminPermissionBoolean
} = require('./checkPermission')
const createSlugify = require('./createSlugify')
const { formatBytes, getHostUrl } = require('./helpers')
const { storage, checkImageFileType, uploadImage } = require('./multer')
const { uploadFileCloudinary } = require('./uploadFileCloudinary')

module.exports = {
  createJWTtoken,
  isTokenValid,
  createTokenUser,
  createUserData,
  user_role,
  admin_role,
  checkPermission,
  checkAdminPermissionBoolean,
  createSlugify,
  formatBytes,
  storage,
  checkImageFileType,
  uploadImage,
  uploadFileCloudinary,
  getHostUrl
}
