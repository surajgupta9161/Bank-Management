const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: [true, 'Account is required'],
    index: true,
    immutable: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required while creating ledger'],
    immutable: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transaction',
    required: [true, 'Transaction is required while creating ledger'],
    immutable: true,
    index: true
  },
  type: {
    type: String,
    enum: {
      values: ['credit', 'debit'],
      message: 'Type can be credit or debit'
    },
    required: [true, 'Type is required while creating ledger'],
    immutable: true
  }
})

function preventLedgerModification () {
  throw new Error('Ledger cannot be modified')
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
ledgerSchema.pre('findOneAndReplace', preventLedgerModification)
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)
ledgerSchema.pre('updateOne', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification)
ledgerSchema.pre('deleteOne', preventLedgerModification)
ledgerSchema.pre('deleteMany', preventLedgerModification)
ledgerSchema.pre('replaceOne', preventLedgerModification)
ledgerSchema.pre('remove', preventLedgerModification)

const ledgerModel = mongoose.model('ledger', ledgerSchema)

module.exports = ledgerModel
