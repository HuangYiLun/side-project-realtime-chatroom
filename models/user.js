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
    required: true
  },
  status: {
    type: String,
    required: false
  },
  isAdmin: {
    type: Boolean,
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

module.exports = mongoose.model('User', userSchema)