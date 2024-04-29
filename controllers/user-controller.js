const User = require("../models/user")
const bcrypt = require("bcryptjs")
const helpers = require("../helpers/auth-helper")
const { imgurFileHelper } = require("../helpers/file-helper")
const {
  sendErrorResponse,
  CustomError,
} = require("../helpers/error-response-helper")
const userService = require("../services/user-serivces")
const mongoose = require("mongoose")

const FRIENDS_URL = "/friends"
const SENT_FRIENDS_TYPE = "sent"
const RECEIVED_FRIENDS_TYPE = "received"

const userController = {
  getSignIn: (req, res) => {
    return res.render("signin")
  },
  signIn: (req, res) => {
    req.flash("success_msg", "成功登入")
    res.redirect("/friends")
  },
  getSignUp: (req, res) => {
    return res.render("signup")
  },
  signUp: async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.render("signup", {
        name,
        email,
        password,
        confirmPassword,
        danger_msg: "欄位不得空白",
      })
    }
    if (password !== confirmPassword) {
      return res.render("signup", {
        name,
        email,
        password,
        confirmPassword,
        danger_msg: "密碼不一致",
      })
    }

    try {
      const usedEmail = await User.findOne({ email })
      if (usedEmail) {
        return res.render("signup", {
          name,
          email,
          password,
          confirmPassword,
          danger_msg: "信箱已被使用",
        })
      }
      const usedName = await User.findOne({ name })
      if (usedName) {
        return res.render("signup", {
          name,
          email,
          password,
          confirmPassword,
          danger_msg: "名稱已被使用",
        })
      }

      const hashPassword = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hashPassword,
      })
      req.flash("success_msg", "註冊成功，請重新登入")
      res.redirect("/signin")
    } catch (err) {
      return next(err)
    }
  },
  signOut: (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err)
      }
      req.flash("success_msg", "成功登出")
      res.redirect("/signin")
    })
  },
  getProfile: async (req, res, next) => {
    const { userId } = req.params
    const loginUser = helpers.getUser(req)
    // 判斷是否本人
    if (loginUser._id.toString() !== userId) return res.redirect("back")

    try {
      const user = await User.findById(userId)
      const {
        _id,
        email,
        name,
        password,
        avatar,
        introduction,
        createdAt,
        updatedAt,
      } = user
      // 是否查詢到user
      if (!user) {
        req.flash("danger_msg", "該使用者不存在")
        return res.redirect("back")
      }
      // 查詢成功
      return res.render("profile", {
        userId: _id,
        email,
        name,
        password,
        avatar,
        introduction,
        createdAt,
        updatedAt,
      })
    } catch (err) {
      next(err)
    }
  },
  putProfile: async (req, res, next) => {
    // 取得form 資料
    const { userId } = req.params
    const avatar = req.file
    let { name, email, password, confirmPassword, introduction } = req.body

    name = name.trim()
    email = email.trim()
    password = password.trim()
    confirmPassword = confirmPassword.trim()
    introduction = introduction.trim()

    // 取得目前登入使用者
    const loginUser = helpers.getUser(req)
    // 判斷是否本人
    if (loginUser._id.toString() !== userId) throw new Error("不具修改權限")

    try {
      // 查詢對應user
      const userMongoDB = await User.findById(userId)
      //user不存在就拋錯
      if (!userMongoDB) throw new Error("帳號不存在")
      //轉換javascript objects,方便使用
      const user = userMongoDB.toObject()
      // 查詢email是否重複
      if (email && email !== user.email) {
        const sameEmailCount = await User.countDocuments({
          email,
          _id: { $ne: userId },
        })
        if (sameEmailCount > 0) throw new Error("信箱已重複註冊")
      }
      // 檢查資料是否正確
      if (avatar?.size > 10485760) throw new Error("圖片大小超出10MB")
      if (name?.length > 20) throw new Error("名稱字數超出上限")
      if (introduction?.length > 160) throw new Error("自介字數超出上限")
      if (password?.length > 12) throw new Error("密碼長度超出上限")
      if (password !== confirmPassword) throw new Error("密碼不一致")
      // update
      userMongoDB.name = name || user.name
      userMongoDB.email = email || user.email
      userMongoDB.introduction = introduction || user.introduction
      //如果avatar存在，則上傳imgur
      if (avatar) {
        userMongoDB.avatar = (await imgurFileHelper(avatar)) || user.avatar
      }
      if (password) {
        userMongoDB.password =
          (await bcrypt.hash(password, 10)) || user.password
      }
      await userMongoDB.save()
      res.redirect("back")
    } catch (err) {
      next(err)
    }
  },
  search: async (req, res, next) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : ""
    const loginUser = helpers.getUser(req)

    // 沒有搜尋關鍵字
    if (!keyword) {
      console.log("enter search query")
      return res.render("search")
    }

    try {
      const users = await userService.searchUsers(keyword, loginUser)
      console.log("searchusers", users)
      return res.render("search", { users, keyword })
    } catch (err) {
      console.error(err)
      next(err)
    }
  },
  getFriendPage: (req, res) => {
    const partialName = "friends"
    const loginUser = helpers.getUser(req)
    const type = req.query.type || ""
    const { friends, sentFriendsRequest, getFriendsRequest } = loginUser
    let users = []
    let isFriends = false
    let isSendInvitation = false
    let isReceivedInvitation = false

    //解構賦值取出user屬性
    const mapUser = ({ _id, name, avatar, introduction }) => ({
      _id: _id.toString(),
      name,
      avatar,
      introduction,
    })

    if (type === "sent") {
      isSendInvitation = true
      users = sentFriendsRequest.map(mapUser)
    } else if (type === "received") {
      isReceivedInvitation = true
      users = getFriendsRequest.map(mapUser)
    } else {
      isFriends = true
      users = friends.map(mapUser)
    }
    return res.render("friends", {
      partialName,
      users,
      isFriends,
      isSendInvitation,
      isReceivedInvitation,
    })
  },
  sendRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = helpers.getUser(req)._id.toString()

    try {
      //確認邀請對象不是自己
      if (friendId === userId) {
        throw new CustomError(400, "不能傳送交友邀請給自己")
      }

      const result = await userService.sendFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to send friend request!")
      }

      return res.json({
        status: "success",
        message: "friend request sent successfully.",
      })
    } catch (err) {
      console.error("sendRequest:", err)
      sendErrorResponse(res, err.status, err.message)
    }
  },
  cancelRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = helpers.getUser(req)._id.toString()
    //開啟新的session
    const session = await mongoose.startSession()
    try {
      //使用session執行all or noting
      await session.withTransaction(async () => {
        // 定義session中的操作
        const operations = [
          {
            updateOne: {
              filter: { _id: userId },
              update: { $pull: { sentFriendsRequest: friendId } },
            },
          },
          {
            updateOne: {
              filter: { _id: friendId },
              update: { $pull: { getFriendsRequest: userId } },
            },
          },
        ]
        // 使用 bulkWrite 執行操作
        await User.bulkWrite(operations, { session })
        res.redirect(`${FRIENDS_URL}?type=${SENT_FRIENDS_TYPE}`)
      })
    } catch (err) {
      return next(err)
    } finally {
      try {
        // 關閉session
        await session.endSession()
      } catch (sessionErr) {
        console.error("Error ending session:", sessionErr)
        return next(sessionErr)
      }
    }
  },
  acceptRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = helpers.getUser(req)._id.toString()
    //開啟新的session
    const session = await mongoose.startSession()
    try {
      //使用session執行all or noting
      await session.withTransaction(async () => {
        // 定義session中的操作
        const operations = [
          // 本人同意收到的朋友請求，更新friends跟getFriendsRequest
          {
            updateOne: {
              filter: { _id: userId },
              update: {
                $pull: { getFriendsRequest: friendId },
                $addToSet: { friends: friendId },
              },
            },
          },
          // 對方的發出的朋友請求被接受，更新friends跟sentFriendsRequest
          {
            updateOne: {
              filter: { _id: friendId },
              update: {
                $pull: { sentFriendsRequest: userId },
                $addToSet: { friends: userId },
              },
            },
          },
        ]
        // 使用 bulkWrite 執行操作
        await User.bulkWrite(operations, { session })
        // res.redirect(`${FRIENDS_URL}?type=${RECEIVED_FRIENDS_TYPE}`)
        res.json({
          status: "success",
          message: "accept friend successfully.",
        })
      })
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "accept friend error" })
    } finally {
      try {
        // 關閉mongoose session
        await session.endSession()
      } catch (sessionErr) {
        console.error("Error ending session:", sessionErr)
        return res
          .status(500)
          .json({ status: "error", message: "資料庫錯誤，請稍後再試" })
      }
    }
  },
  rejectRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = helpers.getUser(req)._id.toString()
    //開啟新的session
    const session = await mongoose.startSession()
    try {
      //使用session執行all or noting
      await session.withTransaction(async () => {
        // 定義session中的操作
        const operations = [
          // 本人拒絕收到的朋友請求，更新本人的getFriendsRequest array
          {
            updateOne: {
              filter: { _id: userId },
              update: {
                $pull: { getFriendsRequest: friendId },
              },
            },
          },
          // 對方的發出的朋友請求被拒絕，更新對方的sentFriendsRequest array
          {
            updateOne: {
              filter: { _id: friendId },
              update: {
                $pull: { sentFriendsRequest: userId },
              },
            },
          },
        ]
        // 使用 bulkWrite 執行操作
        await User.bulkWrite(operations, { session })
        res.redirect(`${FRIENDS_URL}?type=${RECEIVED_FRIENDS_TYPE}`)
      })
    } catch (err) {
      return next(err)
    } finally {
      try {
        // 關閉mongoose session
        await session.endSession()
      } catch (sessionErr) {
        console.error("Error ending session:", sessionErr)
        return next(sessionErr)
      }
    }
  },
  removeFriend: async (req, res) => {
    const friendId = req.params.userId
    const userId = helpers.getUser(req)._id.toString()
    //開啟新的session
    const session = await mongoose.startSession()
    try {
      //使用session執行all or noting
      await session.withTransaction(async () => {
        // 定義session中的操作
        const operations = [
          {
            updateOne: {
              filter: { _id: userId },
              update: {
                $pull: { friends: friendId },
              },
            },
          },
          {
            updateOne: {
              filter: { _id: friendId },
              update: {
                $pull: { friends: userId },
              },
            },
          },
        ]
        // 使用 bulkWrite 執行操作
        await User.bulkWrite(operations, { session })
        res.redirect(`${FRIENDS_URL}`)
      })
    } catch (err) {
      console.error(err)
      return next(err)
    } finally {
      try {
        // 關閉mongoose session
        await session.endSession()
      } catch (sessionErr) {
        console.error("Error ending session:", sessionErr)
        return next(sessionErr)
      }
    }
  },
}

module.exports = userController
