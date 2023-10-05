const mongoose = require('mongoose')

// 僅在非正式環境時，使用dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//setting connect to mongodb
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

//acquire mongodb connection
const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))

db.once('open', () => console.log('mongodb connected'))

module.exports = db