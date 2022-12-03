const register = async (req, res) => {
  res.send('Register Admin')
}

const login = async (req, res) => {
  res.send('Login Admin')
}

module.exports = {
  register,
  login
}
