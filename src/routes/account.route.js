const express = require('express')
const accountController = require('../controllers/account.controller')
const middleware = require('../middleware/auth.middleware')

const router = express.Router()
/**
 * - POST /api/account/create
 * - Create a new account
 * - Protected
 */
router.post(
  '/create',
  middleware.authMiddleware,
  accountController.createAccount
)

module.exports = router
