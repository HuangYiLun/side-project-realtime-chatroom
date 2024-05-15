const { CustomError } = require("../helpers/error-response-helper")
const userService = require("../services/user-serivces")
const { getUser } = require("../helpers/auth-helper")
const bcrypt = require("bcryptjs")

const userController = {
  getSignIn: (req, res) => {
    res.render("signin")
  },
  signIn: (req, res) => {
    req.flash("success_msg", "成功登入")
    res.redirect("/search")
  },
  getSignUp: (req, res) => {
    res.render("signup")
  },
  signUp: async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body

    // 重新渲染時，顯示使用者已輸入的data
    const renderSignup = (msg) =>
      res.render("signup", {
        name,
        email,
        password,
        confirmPassword,
        danger_msg: msg,
      })

    if (!name.trim() || !email.trim() || !password.trim()) {
      return renderSignup("欄位不得空白")
    }
    if (password !== confirmPassword) {
      return renderSignup("密碼不一致")
    }

    try {
      const usedEmail = await userService.getUserByEmail(email)
      if (usedEmail) {
        return renderSignup("信箱已被使用")
      }

      const hashPassword = await bcrypt.hash(password, 10)
      const newUser = await userService.createUser(name, email, hashPassword)

      if (!newUser) throw new CustomError(500, "創建帳號失敗")

      req.flash("success_msg", "註冊成功，請重新登入")
      res.redirect("/signin")
    } catch (err) {
      next(err)
    }
  },
  signOut: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err)
      }
      req.flash("success_msg", "成功登出")
      res.redirect("/signin")
    })
  },
  getProfile: async (req, res) => {
    const loginUser = getUser(req)
    const { email, name, avatar, introduction } = loginUser

    return res.render("profile", {
      email,
      name,
      avatar,
      introduction,
    })
  },
  search: async (req, res, next) => {
    const partialName = "search"
    const keyword = req.query.keyword ? req.query.keyword.trim() : ""
    const loginUser = getUser(req)
    // 沒有搜尋關鍵字
    if (!keyword) return res.render("search", { partialName })

    try {
      const users = await userService.searchUsers(keyword, loginUser)
      return res.render("search", {
        partialName,
        users,
        keyword,
      })
    } catch (err) {
      console.error(err)
      next(err)
    }
  },
  getFriendPage: (req, res) => {
    const partialName = "friends"
    const type = req.query.type || ""
    const loginUser = getUser(req)

    // 預備回傳的users
    let users = []

    // 回傳users跟使用者的關係
    let isFriends = false
    let isSendInvitation = false
    let isReceivedInvitation = false

    const { friends, sentFriendsRequest, getFriendsRequest } = loginUser

    // 依照type決定回傳資料
    if (type === "sent") {
      isSendInvitation = true
      users = sentFriendsRequest
    } else if (type === "received") {
      isReceivedInvitation = true
      users = getFriendsRequest
    } else {
      isFriends = true
      users = friends
    }

    return res.render("friends", {
      partialName,
      users,
      isFriends,
      isSendInvitation,
      isReceivedInvitation,
    })
  },
  cancelRequest: async (req, res, next) => {
    const friendId = req.params.userId
    const userId = getUser(req)._id

    try {
      const result = await userService.cancelFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to cancel friend request!")
      }
      res.redirect("back")
    } catch (err) {
      next(err)
    }
  },
  rejectRequest: async (req, res, next) => {
    const friendId = req.params.userId
    const userId = getUser(req)._id

    try {
      const result = await userService.rejectFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to reject friend request!")
      }
      res.redirect("back")
    } catch (err) {
      next(err)
    }
  },
  removeFriend: async (req, res, next) => {
    const friendId = req.params.userId
    const userId = getUser(req)._id

    try {
      const result = await userService.removeFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to remove friend!")
      }
      res.redirect("back")
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
