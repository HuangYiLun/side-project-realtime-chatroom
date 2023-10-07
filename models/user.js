const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  account: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  introduction: {
    type: String,
    default: '沒有留下任何資訊'
  },
  status: {
    type: String,
    required: false
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  } 
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User