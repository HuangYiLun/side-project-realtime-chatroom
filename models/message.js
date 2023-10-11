const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chatroomId: {
    type: Schema.Types.ObjectId,
    ref: 'Chatroom',
    require: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)