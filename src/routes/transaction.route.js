const { Router } = require('express')
const transactionController = require('../controllers/transaction.controller')
const transactionRoute = Router()
const emailService = require('../services/email.service')
const authMiddleware = require('../middleware/auth.middleware')

/**
 * - POST /api/transaction/create
 */
transactionRoute.post(
  '/create',
  authMiddleware.authMiddleware,
  transactionController.createTransaction
)

module.exports = transactionRoute
