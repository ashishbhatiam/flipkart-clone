const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')
const { createSlugify, formatBytes, uploadFileCloudinary } = require('../utils')
const { BadRequestError, NotFoundError } = require('../errors')

const createCategory = async (req, res) => {
  const { name, parent: parentId } = req.body
  const categoryFile = req.file
  // File Size Validation
  const maxSize = 1024 * 2048
  if (categoryFile.size > maxSize) {
    throw new BadRequestError(
      `Please Upload Category image smaller than ${formatBytes(maxSize)} only.`
    )
  }
  let payload = {
    name,
    slug: createSlugify(name)
  }
  if (parentId) {
    const categoryParent = await Category.findOne({ _id: parentId })
    if (!categoryParent) {
      throw new NotFoundError(`No category found with parent id: ${parentId}`)
    }
    payload['parent'] = parentId
  }

  const result = await uploadFileCloudinary(categoryFile)
  payload['img'] = result.url

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
  // Custom Recursive solution

  // const category = await Category.find({}).populate({
  //   path: 'children',
  //   populate: { path: 'children' }
  // })

  // const nestedCategoriesList = nestedCategories(category)
  // res.status(StatusCodes.OK).json({
  //   count: nestedCategoriesList.length,
  //   category: nestedCategoriesList
  // })

  /* ---------------------------------------------------- */

  // Single Lookup pipeline
  // const category = await Category.aggregate([
  //   // Match All
  //   {
  //     $match: {}
  //   },
  //   // Single Lookup pipeline
  //   {
  //     $lookup: {
  //       from: 'categories',
  //       let: {
  //         category_id: '$_id'
  //       },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [{ $eq: ['$parent', '$$category_id'] }]
  //             }
  //           }
  //         }
  //       ],
  //       as: 'children'
  //     }
  //   },
  //   // Query Record with No Parent
  //   {
  //     $match: {
  //       parent: null
  //     }
  //   }
  // ])

  /* ---------------------------------------------------- */

  // Nested [6 LEVEL] Lookup Pipeline
  const category = await Category.aggregate([
    // Match All
    {
      $match: {}
    },
    // Nested Lookup Pipeline
    {
      $lookup: {
        from: 'categories',
        let: {
          category_id: '$_id'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ['$parent', '$$category_id'] }]
              }
            }
          },
          {
            $lookup: {
              from: 'categories',
              let: {
                category_id: '$_id'
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ['$parent', '$$category_id'] }]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'categories',
                    let: {
                      category_id: '$_id'
                    },
                    pipeline: [
                      {
                        $match: {
                          $expr: {
                            $and: [{ $eq: ['$parent', '$$category_id'] }]
                          }
                        }
                      },
                      {
                        $lookup: {
                          from: 'categories',
                          let: {
                            category_id: '$_id'
                          },
                          pipeline: [
                            {
                              $match: {
                                $expr: {
                                  $and: [{ $eq: ['$parent', '$$category_id'] }]
                                }
                              }
                            },
                            {
                              $lookup: {
                                from: 'categories',
                                let: {
                                  category_id: '$_id'
                                },
                                pipeline: [
                                  {
                                    $match: {
                                      $expr: {
                                        $and: [
                                          { $eq: ['$parent', '$$category_id'] }
                                        ]
                                      }
                                    }
                                  },
                                  {
                                    $lookup: {
                                      from: 'categories',
                                      let: {
                                        category_id: '$_id'
                                      },
                                      pipeline: [
                                        {
                                          $match: {
                                            $expr: {
                                              $and: [
                                                {
                                                  $eq: [
                                                    '$parent',
                                                    '$$category_id'
                                                  ]
                                                }
                                              ]
                                            }
                                          }
                                        }
                                      ],
                                      as: 'children'
                                    }
                                  }
                                ],
                                as: 'children'
                              }
                            }
                          ],
                          as: 'children'
                        }
                      }
                    ],
                    as: 'children'
                  }
                }
              ],
              as: 'children'
            }
          }
        ],
        as: 'children'
      }
    },
    // Query Record with No Parent
    {
      $match: {
        parent: null
      }
    }
  ])

  res.status(StatusCodes.OK).json({
    count: category.length,
    category: category
  })
}

const getSingleCategory = async (req, res) => {
  const { id: categoryId } = req.params
  const category = await Category.findOne({ _id: categoryId })
  if (!category) {
    throw new NotFoundError(`No category found with id: ${categoryId}.`)
  }
  res.status(StatusCodes.OK).json(category)
}

const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params
  const { parent: parentId, name } = req.body
  let category = await Category.findOne({ _id: categoryId })

  if (!category) {
    throw new NotFoundError(`No category found with id: ${categoryId}.`)
  }

  // Update Parent
  if (parentId) {
    const categoryParent = await Category.findOne({ _id: parentId })
    console.log('categoryParent: ', categoryParent)
    if (!categoryParent) {
      throw new NotFoundError(`No category found with parent id: ${parentId}`)
    }
    category['parent'] = parentId
  }

  // Update Image
  const categoryFile = req.file
  if (categoryFile) {
    // File Size Validation
    const maxSize = 1024 * 2048
    if (categoryFile.size > maxSize) {
      throw new BadRequestError(
        `Please Upload Category image smaller than ${formatBytes(
          maxSize
        )} only.`
      )
    }

    const result = await uploadFileCloudinary(categoryFile)
    category['img'] = result.url
  }
  // Update Name & Slug
  if (name) {
    category['name'] = name
    category['slug'] = createSlugify(name)
  }

  await category.save()

  res.status(StatusCodes.OK).json(category)
}

const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params
  const category = await Category.findOneAndDelete({ _id: categoryId })
  console.log('category: ', category);
  if (!category) {
    throw new NotFoundError(`No category found with id: ${categoryId}.`)
  }
  res.status(StatusCodes.OK).end()
}

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
}
