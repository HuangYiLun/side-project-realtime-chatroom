const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "https://i.imgur.com/VUhtTKV.png",
    },
    introduction: {
      type: String,
      default: "沒有留下任何資訊",
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      { _id: false },
    ],
    sentFriendsRequest: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      { _id: false },
    ],
    getFriendsRequest: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      { _id: false },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
)

userSchema.set("toJSON", {
  transform: function (_, ret, _) {
    // 隱藏 password 屬性
    delete ret.password
    // 將 _id 轉換為字符串
    ret._id = ret._id.toString()
    // 回傳
    return ret
  },
})

const User = mongoose.model("User", userSchema)

module.exports = User
