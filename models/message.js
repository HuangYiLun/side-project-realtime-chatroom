const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Message', messageSchema)