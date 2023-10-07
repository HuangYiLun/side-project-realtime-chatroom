const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatroomSchema = new Schema({
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  chatroomName: {
    type: String,
    require: true,
    trim: true
  },
  isGroup: {
    type: Boolean,
    require: true,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('Chatroom', chatroomSchema)