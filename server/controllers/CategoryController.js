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

const nestedCategories = (categories, parentId = null) => {
  let categoryList = []
  let category

  if (parentId) {
    category = categories.filter(cat => String(cat.parent) === String(parentId))
    console.log('category: ', category)
  } else {
    category = categories.filter(cat => !cat.parent)
  }

  for (const cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      createdAt: cate.createdAt,
      updatedAt: cate.updatedAt,
      children: nestedCategories(categories, cate._id)
    })
  }

  return categoryList
}

const getAllCategories = async (req, res) => {
  const category = await Category.find({})
  const nestedCategoriesList = nestedCategories(category)
  res.status(StatusCodes.OK).json({
    count: nestedCategoriesList.length,
    category: nestedCategoriesList
  })
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
