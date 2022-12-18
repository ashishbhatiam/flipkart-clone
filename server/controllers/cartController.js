const Cart = require('../models/Cart')
const Product = require('../models/Product')
const { NotFoundError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')

// Get Cart Items with subtotal Query
const getCartItemsQuery = async userId => {
  return await Cart.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $project: {
        user: 1,
        quantity: 1,
        productName: '$product.name',
        productId: '$product._id',
        productSlug: '$product.slug',
        productPrice: '$product.price',
        subTotal: { $multiply: ['$quantity', { $sum: '$product.price' }] }
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$subTotal' },
        lineItems: {
          $push: {
            _id: '$_id',
            user: '$user',
            productId: '$productId',
            productName: '$productName',
            productSlug: '$productSlug',
            productPrice: '$productPrice',
            quantity: '$quantity',
            subTotal: '$subTotal'
          }
        }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ])
}

const getCartItems = async (req, res) => {
  const { _id: userId } = req.user

  const result = await getCartItemsQuery(userId)
  await res.status(StatusCodes.OK).json({
    totalAmount:
      result?.length && result[0]?.totalAmount ? result[0].totalAmount : 0,
    lineItems:
      result?.length && result[0]?.lineItems?.length ? result[0].lineItems : []
  })
}

const toggleCartItem = async (req, res) => {
  const { _id: userId } = req.user
  const { id: productId } = req.params
  const isProductFound = await Product.findOne({ _id: productId })
  if (!isProductFound) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  const isCartItemFound = await Cart.findOne({
    user: userId,
    product: productId
  })
  if (isCartItemFound) {
    await isCartItemFound.remove()
  } else {
    await Cart.create({ user: userId, product: productId })
  }

  const result = await getCartItemsQuery(userId)
  res.status(StatusCodes.OK).json({
    totalAmount:
      result?.length && result[0]?.totalAmount ? result[0].totalAmount : 0,
    lineItems:
      result?.length && result[0]?.lineItems?.length ? result[0].lineItems : []
  })
}

const updateCartQuantity = async (req, res) => {
  const { id: productId } = req.params
  const { _id: userId } = req.user
  const { quantity } = req.body
  let cartItem = await Cart.findOne({
    user: userId,
    product: productId
  })
  if (!cartItem) {
    throw new NotFoundError(`No product found in cart with id: ${productId}.`)
  }
  if (!quantity) {
    throw new BadRequestError(`Please provide product quantity.`)
  }
  cartItem['quantity'] = quantity
  await cartItem.save()

  const result = await getCartItemsQuery(userId)
  res.status(StatusCodes.OK).json({
    totalAmount:
      result?.length && result[0]?.totalAmount ? result[0].totalAmount : 0,
    lineItems:
      result?.length && result[0]?.lineItems?.length ? result[0].lineItems : []
  })
}

module.exports = {
  getCartItems,
  toggleCartItem,
  updateCartQuantity
}
