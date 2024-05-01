const { getUser } = require("../../helpers/auth-helper")
const notificationService = require("../../services/notification-services")
const userService = require("../../services/user-serivces")
const Notification = require("../../models/notification")
const formatTime = require("../../utilities/formatTime")

const {
  sendErrorResponse,
  CustomError,
} = require("../../helpers/error-response-helper")

const notificationController = {
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
      console.error("api notification controller getNotifications",err)
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

module.exports = notificationController
