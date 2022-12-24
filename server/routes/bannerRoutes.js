const express = require('express')
const router = express.Router()
const {
  createBanner,
  getFeaturedBanners,
  updateBanner,
  deleteBanner,
  getSingleBanner,
  getAllBanners
} = require('../controllers/bannerController')
const {
  authenticationMiddleware,
  authorizePermissonsMiddleware
} = require('../middleware/authentication')
const { admin_role, uploadImage } = require('../utils')

router
  .route('/')
  .get(getFeaturedBanners)
  .post(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    uploadImage.fields([{ name: 'banner' }, { name: 'products' }]),
    createBanner
  )
router
  .route('/all')
  .get(
    authenticationMiddleware,
    authorizePermissonsMiddleware(admin_role),
    getAllBanners
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
