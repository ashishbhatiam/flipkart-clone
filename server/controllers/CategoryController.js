const createCategory = async (req, res) => {
  res.send('Create Category')
}

const getAllCategories = async (req, res) => {
  res.send('Get All Catogories')
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
