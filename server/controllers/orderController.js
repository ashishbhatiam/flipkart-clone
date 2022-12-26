const createOrder = async (req, res) => {
  res.send('Create Order')
}

const updateOrderStatus = async (req, res) => {
  res.send('Update Order STatus')
}

const getAllOrder = async (req, res) => {
  res.send('Get All Orders')
}

const getSingleOrder = async (req, res) => {
  res.send('Get Single Order')
}

module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrder,
  getSingleOrder
}
