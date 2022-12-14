const express = require('express')
const router = express.Router()
const {
  createReview,
  getAllProductReviews,
  getSingleReview,
  deleteReview,
  updateReview
} = require('../controllers/reviewController')
const { authenticationMiddleware } = require('../middleware/authentication')

router
  .route('/')
  .get(getAllProductReviews)
  .post(authenticationMiddleware, createReview)

router
  .route('/:id')
  .get(getSingleReview)
  .delete(authenticationMiddleware, deleteReview)
  .patch(authenticationMiddleware, updateReview)

module.exports = router
