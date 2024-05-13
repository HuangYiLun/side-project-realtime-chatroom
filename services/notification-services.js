const Notification = require("../models/notification")
const formatTime = require("../utilities/formatTime")

const notificationService = {
  postFriendRequest: async (userId, userName, friendId, type, redirectUrl) => {
    const message = `你有一個新的交友邀請: ${userName}`
    const newNotification = await Notification.create({
      toUserId: friendId,
      fromUserId: userId,
      message,
      type,
      redirectUrl,
    })
    return newNotification
  },
  postAcceptFriend: async (
    userId,
    userName,
    friendId,
    friendName,
    type,
    redirectUrl
  ) => {
    // 創建從傳送者到接收者的通知
    const messageToFriend = `你跟${userName}成為朋友了`
    const notificationToFriendPromise = Notification.create({
      toUserId: friendId,
      fromUserId: userId,
      message: messageToFriend,
      type,
      redirectUrl,
    })

    // 創建從接收者到傳送者的通知
    const messageToUser = `你跟${friendName}成為朋友了`
    const notificationToUserPromise = Notification.create({
      toUserId: userId,
      fromUserId: friendId,
      message: messageToUser,
      type,
      redirectUrl,
    })

    // 使用 Promise.all 等待所有通知創建操作完成
    const [notificationToFriend, notificationToUser] = await Promise.all([
      notificationToFriendPromise,
      notificationToUserPromise,
    ])

    // 返回兩個通知的array
    return [notificationToFriend, notificationToUser]
  },
  updateMultipleNotificationsToRead: async (notificationIds) => {
    const patchNotification = await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { isRead: true }
    )
    return patchNotification
  },
  getNotifications: async (userId) => {
    const notifications = await Notification.find({
      toUserId: userId,
    })
      .populate({
        path: "fromUserId",
        select: "_id avatar name",
      })
      .sort({ createdAt: -1 })
      .lean()

    return notifications
  },
  formatTime: (notifications) => {
    notifications.forEach((notification) => {
      notification.createdAt = formatTime(notification.createdAt)
    })
    return notifications
  },
  deleteNotification: async (deleteId) => {
    const deletedNotification = await Notification.deleteOne({
      _id: deleteId,
    })
    return deletedNotification
  },
}

module.exports = notificationService
