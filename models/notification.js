const mongoose = require("mongoose")
const Schema = mongoose.Schema

const notificationSchema = new Schema(
  {
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["friendRequest", "friendAccepted"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      require: true,
    },
    redirectUrl: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Notification", notificationSchema)
