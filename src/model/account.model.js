const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'frozen', 'closed'],
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

accountSchema.index({ user: 1, status: 1 })

const accountModel = mongoose.model('account', accountSchema)

module.exports = accountModel
