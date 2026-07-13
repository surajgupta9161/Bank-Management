const mongoose = require('mongoose')

const mongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDb connected')
  } catch (error) {
    console.error('MongoDb connection error', error.message)
    process.exit(1)
  }
}

module.exports = mongoDb
