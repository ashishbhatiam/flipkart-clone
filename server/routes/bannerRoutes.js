const express = require('express')
const router = express.Router()
const {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  getSingleBanner
} = require('../controllers/bannerController')
const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role } = require('../utils')

router
  .route('/')
  .get(getBanners)
  .post(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    createBanner
  )
router
  .route('/:id')
  .get(getSingleBanner)
  .patch(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    updateBanner
  )
  .delete(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    deleteBanner
  )

module.exports = router
