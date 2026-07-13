const express = require('express')
const router = express.Router()
const userAuthController = require('../controllers/auth.controller')

/* POST /api/auth/register */
router.post('/register', userAuthController.userRegister)

/* POST /api/auth/login*/
router.post('/login', userAuthController.userLogin)

module.exports = router
