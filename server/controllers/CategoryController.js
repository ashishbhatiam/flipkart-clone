const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')
const { createSlugify } = require('../utils')
const { BadRequestError } = require('../errors')

const createCategory = async (req, res) => {
  const { name, parent: parentId } = req.body
  let payload = {
    name,
    slug: createSlugify(name)
  }
  if (parentId) {
    const categoryParent = await Category.findOne({ _id: parentId })
    if (!categoryParent) {
      throw new BadRequestError(`No category found with parent id: ${parentId}`)
    }
    payload['parent'] = parentId
  }
  const category = await Category.create(payload)
  res.status(StatusCodes.CREATED).json(category)
}

const getAllCategories = async (req, res) => {
  const categories = await Category.find({}).populate
  res
    .status(StatusCodes.OK)
    .json({ count: categories.length, category: categories })
}

const getSingleCategory = async (req, res) => {
  res.send('Get Single Category')
}

const updateCategory = async (req, res) => {
  res.send('Update Category')
}

const deleteCategory = async (req, res) => {
  res.send('Delele Category')
}

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
}
