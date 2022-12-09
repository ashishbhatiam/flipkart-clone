const createTokenUser = user => {
  return {
    name: user.fullName,
    _id: user._id,
    role: user.role
  }
}

module.exports = createTokenUser
