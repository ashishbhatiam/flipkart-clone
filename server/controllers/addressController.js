const getAllAddress = async (req, res) => {
  res.send('Get All Address')
}

const getSingleAddress = async (req, res) => {
  res.send('Get Single Address')
}

const createAddress = async (req, res) => {
  res.send('Create Address')
}

const updateAddress = async (req, res) => {
  res.send('Update Address')
}

const deleteAddress = async (req, res) => {
  res.send('Delete Address')
}

module.exports = {
  getAllAddress,
  getSingleAddress,
  updateAddress,
  deleteAddress,
  createAddress
}
