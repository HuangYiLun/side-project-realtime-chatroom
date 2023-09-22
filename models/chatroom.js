const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatroomSchema = new Schema({
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  message: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
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

module.exports = mongoose.model('Chatroom', chatroomSchema)