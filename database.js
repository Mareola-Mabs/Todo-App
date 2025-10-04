const mongoose = require('mongoose')
const logger = require('./logger')

module.exports = function connectToMongoose() {
  const uri = process.env.MONGO_URI
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error', err))
}