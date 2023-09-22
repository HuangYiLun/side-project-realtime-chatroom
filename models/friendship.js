const mongoose = require('mongoose')
const Schema = mongoose.Schema

const friendshipSchema = new Schema({
  inviter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invitee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
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

module.exports = mongoose.model('Friendship', friendshipSchema)