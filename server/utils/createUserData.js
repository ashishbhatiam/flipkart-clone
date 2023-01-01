const createUserData = user => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    userName: user.userName,
    email: user.email,
    _id: user._id,
    role: user.role,
    contactNumber: user.contactNumber,
    profilePicture: user.profilePicture
  }
}

module.exports = createUserData
