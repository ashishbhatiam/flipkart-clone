const Banner = require('../models/Banner')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const { getHostUrl, uploadFileCloudinary } = require('../utils')
const { BadRequestError } = require('../errors')

const createBanner = async (req, res) => {
  const { _id: userID } = req.user
  const { title, description, productId, type } = req.body
  const bannerFile = req.files['banner']
  const productFiles = req.files['products']
  const bannerTypes = ['product', 'page']
  if (!type || !title || !description) {
    throw new BadRequestError(
      'banner title, description & type mustbe required.'
    )
  }
  if (!bannerTypes.includes(type)) {
    throw new BadRequestError('Please provide supported banner type.')
  }

  let bannerPayload = {
    title,
    description,
    createdBy: userID,
    type,
    banner: {
      img: null,
      link: getHostUrl(req)
    }
  }

  // Banner Image Validation
  if (!(bannerFile && Array.isArray(bannerFile) && bannerFile.length)) {
    throw new BadRequestError('Please provide atleast one banner image.')
  }
  if (bannerFile.length > 1) {
    throw new BadRequestError('maximun 1 banner image are allowed.')
  }
  // File Size Validation
  const maxBannerSize = 1024 * 5120
  if (bannerFile.some(file => file.size > maxBannerSize)) {
    throw new BadRequestError(
      `Please Upload Banner image smaller than ${formatBytes(
        maxBannerSize
      )} only.`
    )
  }

  if (type === 'product') {
    // Product Validation
    const isProductValid = await Product.findOne({ _id: productId })
    if (!isProductValid) {
      throw new BadRequestError(`No product found with id: ${productId}.`)
    }
    bannerPayload.product = productId
  } else {
    // Product Images Validation
    if (!(productFiles && Array.isArray(productFiles) && productFiles.length)) {
      throw new BadRequestError('Please provide atleast one product image.')
    }
    if (productFiles.length > 10) {
      throw new BadRequestError('maximun 10 product images are allowed.')
    }

    // File Size Validation
    const maxProductSize = 1024 * 2048
    if (productFiles.some(file => file.size > maxProductSize)) {
      throw new BadRequestError(
        `Please Upload Product images smaller than ${formatBytes(
          maxProductSize
        )} only.`
      )
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
    bannerPayload.products = productImages
  }
  for (const file of bannerFile) {
    const result = await uploadFileCloudinary(file)
    bannerPayload.banner.img = result.url
  }

  const banner = new Banner(bannerPayload)
  await banner.save()
  res.status(StatusCodes.CREATED).json(banner)
}
const getBanners = async (req, res) => {
  const banners = await Banner.find({ featured: true })
  res.status(StatusCodes.OK).json(banners)
}

const getSingleBanner = async (req, res) => {
  res.send('Get Single Banner')
}

const updateBanner = async (req, res) => {
  res.send('Update Banner')
}

const deleteBanner = async (req, res) => {
  res.send('Delete Banner')
}

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
  getSingleBanner
}
