const notificationService = require("../services/notification-services")
const chatroomService = require("../services/chatroom-services")
const Notification = require("../models/notification")
const { getUser } = require("../helpers/auth-helper")
const formatTime = require("../utilities/formatTime")
const User = require("../models/user")
const userService = require("../services/user-serivces")
const { sendErrorResponse } = require("../helpers/error-response-helper")

const apiController = {
  getUserAccount: async (req, res) => {
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
  getAllPrivateChats: async (req, res) => {
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
  getCurrentPrivateChat: async (req, res) => {
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
  searchPrivateChats: async (req, res) => {
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
  getNotifications: async (req, res) => {
    const userId = getUser(req)._id

    try {
      const notifications = await Notification.find({
        toUserId: userId,
      })
        .populate({
          path: "fromUserId",
          select: "_id avatar name",
        })
        .lean()

      notifications.forEach((notification) => {
        notification.createdAt = formatTime(notification.createdAt)
      })

      return res.json({ status: "success", data: notifications })
    } catch (err) {
      return res
        .status(500)
        .json({ status: "error", message: "資料庫錯誤，請稍後再試" })
    }
  },
  postNotification: async (req, res) => {
    const currentUser = getUser(req)
    const { toUserId, type, redirectUrl } = req.body

    if (!toUserId || !type || !redirectUrl) {
      return sendErrorResponse(res, 400, "Missing required fields")
    }

    try {
      const friendUser = await userService.getUserById(toUserId)

      if (!friendUser) {
        return sendErrorResponse(
          res,
          404,
          `friendId ${toUserId} doesn't exist!`
        )
      }

      const toUserName = friendUser.name
      let createdNotification

      if (type === "friendRequest") {
        createdNotification = await notificationService.postFriendRequest(
          currentUser._id,
          currentUser.name,
          toUserId,
          type,
          redirectUrl
        )
      } else if (type === "friendAccepted") {
        createdNotification = await notificationService.postAcceptFriend(
          currentUser._id,
          currentUser.name,
          toUserId,
          toUserName,
          type,
          redirectUrl
        )
      } else {
        return sendErrorResponse(res, 400, "Invalid notification type")
      }
      return res.json({
        status: "success",
        message: "新增通知成功",
        data: createdNotification,
      })
    } catch (err) {
      console.error("accept notification error", err)
      return sendErrorResponse(res, 500, "新增通知失敗")
    }
  },
  deleteNotification: async (req, res) => {
    const { deleteId } = req.params

    try {
      const deletedNotification = await Notification.deleteOne({
        _id: deleteId,
      })
      if (deletedNotification.deletedCount > 0) {
        return res.json({ status: "success", message: "刪除通知成功" })
      } else {
        return res
          .status(500)
          .json({ status: "error", message: "刪除通知失敗" })
      }
    } catch (err) {
      return res.status(500).json({ status: "error", message: "刪除通知失敗" })
    }
  },
  patchNotification: async (req, res) => {
    const { unReadNotificationIds } = req.body
    console.log("enter pach notificationIds", unReadNotificationIds)
    try {
      const patchNotifications =
        await notificationService.updateMultipleNotificationsToRead(
          unReadNotificationIds
        )
      console.log("patchNotifications", patchNotifications)
      if (patchNotifications.modifiedCount > 0) {
        return res.json({ status: "success", message: "已讀通知成功" })
      } else {
        return res
          .status(500)
          .json({ status: "error", message: "已讀通知失敗" })
      }
    } catch (err) {
      return res.status(500).json({ status: "error", message: "已讀通知失敗" })
    }
  },
}

module.exports = apiController
