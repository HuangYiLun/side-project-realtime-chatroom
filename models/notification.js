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
  },
  { timestamps: true }
)

module.exports = mongoose.model("Notification", notificationSchema)
