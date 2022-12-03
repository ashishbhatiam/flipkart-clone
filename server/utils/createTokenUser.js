const createTokenUser = user => {
  return {
    name: user.fullName,
    id: user._id,
    role: user.role
  }
}

module.exports = createTokenUser
