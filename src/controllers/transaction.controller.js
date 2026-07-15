const transactionModel = require('../model/transaction.model')
const accountModel = require('../model/account.model')

/**
 * - THE 10-STEP TRANSFER FLOW
 * 1. Validate the request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction "pending"
 * 6. Create debit ledger
 * 7. Create credit ledger
 * 8. Mark transaction "completed"
 * 9. Commit mongo session
 * 10. Send email
 */
const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body

  /*1. Validate the request*/

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        ' All fields fromAccount, toAccount, amount and idempotencyKey is required'
    })
  }

  const fromAccountDetails = await accountModel.findOne({ _id: fromAccount })
  const toAccountDetails = await accountModel.findOne({ _id: toAccount })

  if (!fromAccountDetails || !toAccountDetails) {
    return res
      .status(404)
      .json({ message: 'Sender or receiver account not found' })
  }

  /*2. Validate idempotency key*/

  const existingTransactionExist = await transactionModel.findOne({
    idempotencyKey: idempotencyKey
  })

  if (existingTransactionExist) {
    if (existingTransactionExist.status === 'completed') {
      return res.status(400).json({ message: 'Transaction already completed' })
    } else if (existingTransactionExist.status === 'pending') {
      return res.status(400).json({ message: 'Transaction already pending' })
    } else if (existingTransactionExist.status === 'reversed') {
      return res.status(400).json({ message: 'Transaction already reversed' })
    } else if (existingTransactionExist.status === 'failed') {
      return res.status(400).json({ message: 'Transaction already failed' })
    }
  }
}

module.exports = { createTransaction }
