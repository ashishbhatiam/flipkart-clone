const Review = require('../models/Review')
const Product = require('../models/Product')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const createReview = async (req, res) => {
  const { product: productId, rating, title, comment } = req.body
  const { _id: userId } = req.user
  if (!productId) {
    throw new BadRequestError('Please provide product.')
  }
  const isProductFound = await Product.findOne({ _id: productId })
  if (!isProductFound) {
    throw new NotFoundError(`No productfound with id: ${productId}.`)
  }
  const isProductReviewFound = await Review.findOne({
    user: userId,
    product: productId
  })

  if (isProductReviewFound) {
    throw new BadRequestError('Already submitted review for this product.')
  }
  let reviewPayload = { product: productId, rating, user: userId }
  if (title) {
    reviewPayload['title'] = title
  }
  if (comment) {
    reviewPayload['comment'] = comment
  }
  const review = await Review.create(reviewPayload)
  res.status(StatusCodes.CREATED).json(review)
}

const getAllProductReviews = async (req, res) => {
  const { product: productId } = req.query
  if (!productId) {
    throw new BadRequestError('Please provide product.')
  }
  const isProductFound = await Product.findOne({ _id: productId })
  if (!isProductFound) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews })
}

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
    .populate('product')
    .populate({ path: 'user', select: '-password' })
  if (!review) {
    throw new NotFoundError(`No review found with id: ${reviewId}.`)
  }
  res.status(StatusCodes.OK).json(review)
}

const deleteReview = async (req, res) => {
  res.send('Delete Review')
}

module.exports = {
  createReview,
  getAllProductReviews,
  getSingleReview,
  deleteReview
}
