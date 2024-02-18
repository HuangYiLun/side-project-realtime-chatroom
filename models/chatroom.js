const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatroomSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true
  },
  isPublic: {
    type: Boolean,
    require: true,
    default: false
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message"
  }
}, { timestamps: true })

module.exports = mongoose.model('Chatroom', chatroomSchema)