const jwt = require('jsonwebtoken')
const userModel = require('../model/user.model')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, token not found' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await userModel.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized, user not found' })
    }

    req.user = user
    return next()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { authMiddleware }
