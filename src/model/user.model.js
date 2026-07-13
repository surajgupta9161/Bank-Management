const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      trim: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Min 6 chars, upper, lower, number & special'
      ]
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
