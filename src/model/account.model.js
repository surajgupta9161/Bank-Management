const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'frozen'],
        message: 'Status can be active, inactive or frozen.'
      },
      default: 'active'
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'INR'
    }
  },
  {
    timestamps: true
  }
)

const accountModel = mongoose.model('account', accountSchema)

module.exports = accountModel
