const createBanner = async (req, res) => {
  res.send('Create Banner')
}

const getBanners = async (req, res) => {
  res.send('Get Banners')
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
