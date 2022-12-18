const Cart = require('../models/Cart')
const Product = require('../models/Product')
const { NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')

const getCartItems = async (req, res) => {
  const { _id: userId } = req.user

  // Get Cart Items with subtotal Query
  const result = await Cart.aggregate([
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
  res.status(StatusCodes.OK).json({
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

  // Get Cart Items with subtotal Query
  const result = await Cart.aggregate([
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
  res.status(StatusCodes.OK).json({
    totalAmount:
      result?.length && result[0]?.totalAmount ? result[0].totalAmount : 0,
    lineItems:
      result?.length && result[0]?.lineItems?.length ? result[0].lineItems : []
  })
}

const updateCartQuantity = async (req, res) => {
  res.send('Update Cart Quantity')
}

module.exports = {
  getCartItems,
  toggleCartItem,
  updateCartQuantity
}
