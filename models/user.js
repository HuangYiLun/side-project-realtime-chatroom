const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://i.imgur.com/VUhtTKV.png'
  },
  introduction: {
    type: String,
    default: '沒有留下任何資訊'
  },
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }, { _id: false }],
  sentFriendsRequest: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, { _id: false }],
  getFriendsRequest: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }, { _id: false }],
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User