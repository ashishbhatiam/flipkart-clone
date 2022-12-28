const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Address = require('../models/Address')
const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const { BadRequestError, NotFoundError } = require('../errors')
const { checkPermission, checkAdminPermissionBoolean } = require('../utils')
const OrderStatus = require('../models/OrderStatus')

const createOrder = async (req, res) => {
  const { _id: userId } = req.user
  const { address } = req.body
  if (!address) {
    throw new BadRequestError('Please provide address.')
  }

  const isAddressFound = await Address.findOne({ _id: address })
  if (!isAddressFound) {
    throw new NotFoundError(`No address found with id: ${address}`)
  }
  checkPermission(req.user, isAddressFound.createdBy)

  const cartItems = await Cart.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(userId) }
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
      $unwind: '$product'
    },
    {
      $project: {
        _id: 0,
        product: '$product._id',
        payableAmount: '$product.price',
        quantity: '$quantity'
      }
    }
  ])
  if (!cartItems?.length) {
    throw new BadRequestError('Please provide atleast one item in cart.')
  }
  let total = 0
  for (let index = 0; index < cartItems.length; index++) {
    const item = cartItems[index]
    total += item.payableAmount * item.quantity
  }

  const orderPayload = {
    user: userId,
    address,
    total,
    items: cartItems
  }

  const newOrder = await Order.create(orderPayload)
  const order = await Order.findOne({ _id: newOrder._id })
    .populate('orderStatus address')
    .populate({ path: 'user', select: '-password' })
  res.status(StatusCodes.CREATED).json(order)
}

const updateOrderStatus = async (req, res) => {
  const { id: orderId } = req.params
  const { status } = req.body
  const isOrderFound = await Order.findOne({ _id: orderId })
  if (!isOrderFound) {
    throw new NotFoundError(`No order found with id: ${orderId}`)
  }
  await OrderStatus.create({ order: orderId, status })
  res.status(StatusCodes.OK).end()
}

const getAllOrder = async (req, res) => {
  let queryConditions = {}
  if (!checkAdminPermissionBoolean(req.user)) {
    queryConditions.user = req.user._id
  }
  const orders = await Order.find(queryConditions)
    .populate('orderStatus address')
    .populate({ path: 'user', select: '-password' })
  res.status(StatusCodes.OK).json({ count: orders.length, orders })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
    .populate('orderStatus address')
    .populate({ path: 'user', select: '-password' })
  if (!order) {
    throw new NotFoundError(`No order found with id: ${orderId}`)
  }
  checkPermission(req.user, order.user)
  res.status(StatusCodes.OK).json(order)
}

module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrder,
  getSingleOrder
}
