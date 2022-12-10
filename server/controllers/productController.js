const createProduct = async (req, res) => {
  res.send('Create Product')
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
