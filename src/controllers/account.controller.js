const accountModel = require('../model/account.model')

/**
 * - POST /api/account/create
 */
const createAccount = async (req, res) => {
  const user = req.user
  const account = await accountModel.create({ user })
  return res
    .status(200)
    .json({ message: 'Account created successfully', account })
}

module.exports = {
  createAccount
}
