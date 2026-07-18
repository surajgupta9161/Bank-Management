const transactionModel = require('../model/transaction.model')
const accountModel = require('../model/account.model')
const mongoose = require('mongoose')
const ledgerModel = require('../model/ledger.model')
const emailServices = require('../services/email.service')

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
    if (existingTransactionExist.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Transaction already completed' })
    } else if (existingTransactionExist.status === 'PENDING') {
      return res.status(400).json({ message: 'Transaction already pending' })
    } else if (existingTransactionExist.status === 'REVERSED') {
      return res.status(400).json({ message: 'Transaction already reversed' })
    } else if (existingTransactionExist.status === 'FAILED') {
      return res.status(400).json({ message: 'Transaction already failed' })
    }
  }

  /*3. Check account status*/
  if (
    fromAccountDetails.status !== 'ACTIVE' ||
    toAccountDetails.status !== 'ACTIVE'
  ) {
    return res.status(400).json({ message: 'From or toAccount is closed' })
  }

  /*4. Derive sender balance from ledger*/
  const balance = await fromAccountDetails.getBalance()
  if (balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' })
  }

  /*5 Create transaction "pending" */

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const transaction = new transactionModel({
      fromAccount,
      toAccount,
      amount,
      status: 'PENDING',
      idempotencyKey
    })
    const debitLedger = await ledgerModel.create(
      [
        {
          account: fromAccount,
          type: 'DEBIT',
          amount,
          transaction: transaction._id
        }
      ],
      { session }
    )

    const creditLedger = await ledgerModel.create(
      [
        {
          account: toAccount,
          type: 'CREDIT',
          amount,
          transaction: transaction._id
        }
      ],
      { session }
    )

    transaction.status = 'COMPLETED'
    await transaction.save({ session })

    await session.commitTransaction()
    await session.endSession()

    /*6. Send email*/
    await emailServices.sendTransactionEmail(
      req.user.email,
      fromAccountDetails.name,
      amount,
      toAccountDetails.name
    )

    return res.status(200).json({ message: 'Transaction created successfully' })
  } catch (err) {
    transaction.status = 'FAILED'
    await transaction.save({ session })
    await session.abortTransaction()
    await session.endSession()
    await emailServices.sendTransactionFailedEmail(
      req.user.email,
      fromAccountDetails.name,
      amount,
      toAccountDetails.name
    )
    return res.status(500).json({ message: err.message })
  }
}

module.exports = { createTransaction }
