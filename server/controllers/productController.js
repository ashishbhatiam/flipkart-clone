const { BadRequestError } = require('../errors')
const Product = require('../models/Product')
const Category = require('../models/Category')
const { formatBytes } = require('../utils')
const path = require('path')
const fs = require('fs')
const { StatusCodes } = require('http-status-codes')
const { default: slugify } = require('slugify')
const cloudinary = require('cloudinary').v2

const createProduct = async (req, res) => {
  const { _id: userId } = req.user
  const { name, price, description, category: categoryId, inventory } = req.body

  const productFiles = req.files
  if (!(productFiles && Array.isArray(productFiles) && productFiles.length)) {
    throw new BadRequestError('Please provide atleast one product image.')
  }
  if (productFiles.length > 10) {
    throw new BadRequestError('maximun 10 product images are allowed.')
  }

  // File Size Validation
  const maxSize = 1024 * 2048
  if (productFiles.some(file => file.size > maxSize)) {
    throw new BadRequestError(
      `Please Upload Product images smaller than ${formatBytes(maxSize)} only.`
    )
  }

  const isCategoryValid = await Category.findOne({ _id: categoryId })
  if (!isCategoryValid) {
    throw new BadRequestError(`No category found with id: ${categoryId}.`)
  }

  const productImages = []
  // Upload Images to Cloud
  for (const file of productFiles) {
    const imagePath = path.join(__dirname, '../tmp/uploads', file.originalname)

    // Upload API call
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true,
      folder:
        process.env.NODE_ENV === 'production'
          ? 'flipkart-clone-api-live'
          : 'flipkart-clone-api-dev'
    })

    fs.unlinkSync(imagePath)

    productImages.push({
      img: result.url,
      name: result.original_filename,
      size: result.bytes
    })
  }

  const payload = {
    name,
    slug: slugify(name),
    createdBy: userId,
    price,
    description,
    category: categoryId,
    inventory: Number(inventory),
    productImages
  }
  const product = await Product.create(payload)

  res.status(StatusCodes.CREATED).json(product)
}

const getAllProduct = async (req, res) => {
  res.send('Get All Products')
}

const getSingleProduct = async (req, res) => {
  res.send('Get Single Product')
}

const updateProduct = async (req, res) => {
  res.send('Update Product')
}

const deleteProduct = async (req, res) => {
  res.send('Delete Product')
}

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct
}
