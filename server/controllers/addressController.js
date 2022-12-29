const Address = require('../models/Address')
const { StatusCodes } = require('http-status-codes')
const { checkAdminPermissionBoolean, checkPermission } = require('../utils')
const { NotFoundError } = require('../errors')

const getAllAddress = async (req, res) => {
  let queryConditions = {}
  if (!checkAdminPermissionBoolean(req.user)) {
    queryConditions.createdBy = req.user._id
  }
  const address = await Address.find(queryConditions).sort('-createdAt')
  res.status(StatusCodes.OK).json({ count: address.length, address })
}

const getSingleAddress = async (req, res) => {
  const { id: addressID } = req.params
  const address = await Address.findOne({ _id: addressID })
  if (!address) {
    throw new NotFoundError(`No address found with id: ${addressID}.`)
  }
  checkPermission(req.user, address.createdBy)
  res.status(StatusCodes.OK).json(address)
}

const createAddress = async (req, res) => {
  const { country, ...restAddressObj } = req.body
  const addressPayload = {
    ...restAddressObj,
    createdBy: req.user._id
  }
  const address = await Address.create(addressPayload)
  res.status(StatusCodes.CREATED).json(address)
}

const updateAddress = async (req, res) => {
  const { id: addressID } = req.params
  const { _id, country, createdBy, createdAt, updatedAt, ...restAddressObj } =
    req.body
  let address = await Address.findOne({ _id: addressID })
  if (!address) {
    throw new NotFoundError(`No address found with id: ${addressID}.`)
  }
  checkPermission(req.user, address.createdBy)
  address = Object.assign(address, restAddressObj)
  const updatedAddress = await address.save()
  await res.status(StatusCodes.OK).json(updatedAddress)
}

const deleteAddress = async (req, res) => {
  res.send('Delete Address')
}

module.exports = {
  getAllAddress,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  createAddress
}