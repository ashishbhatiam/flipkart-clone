const { BadRequestError, NotFoundError } = require('../errors')
const Product = require('../models/Product')
const Category = require('../models/Category')
const { formatBytes, uploadFileCloudinary, _pickObj } = require('../utils')
const { StatusCodes } = require('http-status-codes')
const { default: slugify } = require('slugify')

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
    const result = await uploadFileCloudinary(file)

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
  const products = await Product.aggregate([
    {
      $facet: {
        array: [
          {
            $match: {}
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              products: {
                $push: {
                  _id: '$_id',
                  name: '$name',
                  slug: '$slug',
                  price: '$price',
                  description: '$description',
                  category: '$category',
                  createdBy: '$createdBy',
                  productImages: '$productImages',
                  inventory: '$inventory',
                  freeShipping: '$freeShipping',
                  featured: '$featured',
                  averageRating: 'averageRating',
                  numOfReviews: '$numOfReviews',
                  createdAt: '$createdAt',
                  updatedAt: '$updatedAt',
                  averageRating: '$averageRating',
                  numOfReviews: '$numOfReviews'
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              count: '$count',
              products: '$products',
              under5k: {
                $filter: {
                  input: '$products',
                  as: 'item',
                  cond: { $lte: ['$$item.price', 5000] }
                }
              },
              under10k: {
                $filter: {
                  input: '$products',
                  as: 'item',
                  cond: { $lte: ['$$item.price', 10000] }
                }
              },
              under20k: {
                $filter: {
                  input: '$products',
                  as: 'item',
                  cond: { $lte: ['$$item.price', 20000] }
                }
              },
              under30k: {
                $filter: {
                  input: '$products',
                  as: 'item',
                  cond: { $lte: ['$$item.price', 30000] }
                }
              }
            }
          }
        ]
      }
    },
    {
      $project: {
        count: {
          $ifNull: [{ $arrayElemAt: ['$array.count', 0] }, 0]
        },
        products: {
          $ifNull: [{ $arrayElemAt: ['$array.products', 0] }, []]
        },
        under5k: {
          $ifNull: [{ $arrayElemAt: ['$array.under5k', 0] }, []]
        },
        under10k: {
          $ifNull: [{ $arrayElemAt: ['$array.under10k', 0] }, []]
        },
        under20k: {
          $ifNull: [{ $arrayElemAt: ['$array.under20k', 0] }, []]
        },
        under30k: {
          $ifNull: [{ $arrayElemAt: ['$array.under30k', 0] }, []]
        }
      }
    }
  ])
  res.status(StatusCodes.OK).json(products[0])
}

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params
  const product = await Product.findOne({ _id: productId }).select(
    '-inventory -createdBy'
  )
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  res.status(StatusCodes.OK).json(product)
}

const updateProduct = async (req, res) => {
  const { id: productId } = req.params
  const bodyObj = _pickObj(req.body, [
    'name',
    'price',
    'description',
    'category',
    'inventory',
    'featured'
  ])
  let product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  if (bodyObj.category) {
    const category = await Category.findOne({ _id: bodyObj.category })
    if (!category) {
      throw new NotFoundError(`No category found with id: ${bodyObj.category}.`)
    }
  }
  if (bodyObj.name) {
    bodyObj['slug'] = slugify(bodyObj.name)
  }
  const productFiles = req.files
  if (productFiles && Array.isArray(productFiles)) {
    // File Size Validation
    const maxSize = 1024 * 2048
    if (productFiles.some(file => file.size > maxSize)) {
      throw new BadRequestError(
        `Please Upload Product images smaller than ${formatBytes(
          maxSize
        )} only.`
      )
    }
    if (productFiles.length > 10) {
      throw new BadRequestError('maximun 10 product images are allowed.')
    }
  }
  if (productFiles && Array.isArray(productFiles) && productFiles.length) {
    // Upload Images to Cloud
    for (const file of productFiles) {
      const result = await uploadFileCloudinary(file)

      product['productImages'].push({
        img: result.url,
        name: result.original_filename,
        size: result.bytes
      })
    }
  }
  product = Object.assign(product, bodyObj)

  const updatedProduct = await product.save()
  res.status(StatusCodes.OK).json(updatedProduct)
}

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params
  let product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  await product.remove()
  res.status(StatusCodes.OK).end()
}

const deleteProductImage = async (req, res) => {
  const { id: productId } = req.params
  const { imageName } = req.body
  let product = await Product.findOne({ _id: productId })
  if (!product) {
    throw new NotFoundError(`No product found with id: ${productId}.`)
  }
  if (!imageName) {
    throw new BadRequestError('Please provide image name.')
  }
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    { $pull: { productImages: { name: imageName } } },
    { new: true }
  )
  res.status(StatusCodes.OK).json(updatedProduct)
}

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
}
