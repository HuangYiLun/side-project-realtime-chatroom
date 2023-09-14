const mongoose = require('mongoose')

//setting connect to mongodb
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)

//acquire mongodb connection
const db = mongoose.connection

db.on('error', () => console.log('mongodb error'))

db.once('open', () => console.log('mongodb connected'))

module.exports = db