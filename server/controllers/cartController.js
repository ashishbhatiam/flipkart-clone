const getCartItems = async (req, res) => {
  res.send('Get Cart Items')
}

const toggleCartItem = async (req, res) => {
  res.send('Toggle Cart Item')
}

const updateCartQuantity = async (req, res) => {
  res.send('Update Cart Quantity')
}

module.exports = {
  getCartItems,
  toggleCartItem,
  updateCartQuantity
}
