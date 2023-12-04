const mongoose = require('mongoose')
const Schema = mongoose.Schema

const invitationSchema = new Schema({
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
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Invitation', invitationSchema)