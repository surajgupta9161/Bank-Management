const userModel = require('../model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const emailServices = require('../services/email.service')

/**
 *  - POST /api/auth/register
 *  - Register a new user
 *  */
const userRegister = async (req, res) => {
  const { email, name, password } = req.body
  try {
    const isUserExist = await userModel.findOne({ email })
    if (isUserExist) {
      return res.status(400).json({ message: 'User already exist' })
    }
    if (!email || !name || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }
    if (name.length < 3) {
      return res.status(400).json({
        message: 'Name must be at least 3 characters long'
      })
    }

    const user = await userModel.create({
      email,
      name,
      password
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '3d'
    })

    res.cookie('token', token)

    emailServices
      .sendEmailToUser(user.email, user.name)
      .catch(err => console.error('Email Error:', err))

    return res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 *  - POST /api/auth/login
 *  - Login a user
 */
const userLogin = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await userModel.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '3d'
    })

    res.cookie('token', token)

    return res.status(200).json({
      message: 'Login successful'
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { userRegister, userLogin }
