const createReview = async (req, res) => {
  res.send('Create Review')
}

const getAllProductReviews = async (req, res) => {
  res.send('Get All Product Reviews')
}

const getSingleReview = async (req, res) => {
  res.send('Get Single Review')
}

const deleteReview = async (req, res) => {
  res.send('Delete Review')
}

module.exports = {
  createReview,
  getAllProductReviews,
  getSingleReview,
  deleteReview
}
