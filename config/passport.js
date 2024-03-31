const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const User = require("../models/user")
const bcrypt = require("bcryptjs")

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, cb) => {
      try {
        const user = await User.findOne({ email })
        if (!user)
          return cb(null, false, req.flash("danger_msg", "信箱尚未註冊"))

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare)
          return cb(null, false, req.flash("danger_msg", "密碼錯誤"))

        return cb(null, user)
      } catch (err) {
        return cb(err)
      }
    }
  )
)

// 序列化 將user.id儲存在session中
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
// 反序列化 藉由session中user.id找到user
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findById(id)
      .populate({
        path: "sentFriendsRequest",
        select: "_id avatar name email introduction",
      })
      .populate({
        path: "friends",
        select: "_id avatar name email introduction",
      })
      .populate({
        path: "getFriendsRequest",
        select: "_id avatar name email introduction",
      })
    // toJSON()會調用userSchem自定義的toJSON處理
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err)
  }
})

module.exports = passport
