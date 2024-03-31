const { getUser } = require("../helpers/auth-helper")
const User = require("../models/user")
const chatroomService = require("../services/chatroom-services")

const apiController = {
  getUserAccount: async (req, res, next) => {
    const { userId } = req.params
    const loginUser = getUser(req)

    try {
      const user = await User.findById(userId).lean()

      if (!user) {
        return res.status(404).json({ status: "error", messages: "帳號不存在" })
      }

      if (loginUser._id.toString() !== userId) {
        return res
          .status(403)
          .json({ status: "error", messages: "非本人不能操做" })
      }

      return res.json({ status: "success", ...user })
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "資料庫錯誤，請稍後再試" })
    }
  },
  getAllPrivateChats: async (req, res, next) => {
    const currentId = getUser(req)._id
    try {
      const allPrivateChats = await chatroomService.getAllPrivateChats(
        currentId
      )

      return res.json({ status: "success", data: allPrivateChats })
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "資料庫錯誤，請稍後再試" })
    }
  },
  getCurrentPrivateChat: async (req, res, next) => {
    const currentId = getUser(req)._id
    const { receiverId } = req.params
    try {
      const currentPrivateChat =
        await chatroomService.findOrCreatePrivateChatroom(currentId, receiverId)

      return res.json({ status: "success", data: currentPrivateChat })
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "資料庫錯誤，請稍後再試" })
    }
  },
  searchPrivateChats: async (req, res, next) => {
    const keyword = req.query.keyword ? req.query.keyword.trim() : ""
    const currentId = getUser(req)._id

    try {
      const allPrivateChats = await chatroomService.getAllPrivateChats(
        currentId
      )
      // 如果keyword為空，則不進行篩選，直接返回所有私人聊天室
      if (!keyword) {
        return res.json({ status: "success", data: allPrivateChats })
      }

      const filterPrivateChats = allPrivateChats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(keyword.toLowerCase()) ||
          chat.email.toLowerCase() === keyword.toLowerCase()
      )
      
      return res.json({ status: "success", data: filterPrivateChats })
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "資料庫錯誤，請稍後再試" })
    }
  },
}

module.exports = apiController
