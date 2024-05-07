const { getUser } = require("../../helpers/auth-helper")

const {
  sendErrorResponse,
  CustomError,
} = require("../../helpers/error-response-helper")

const userService = require("../../services/user-serivces")

const userController = {
  getUserAccount: async (req, res) => {
    const { userId } = req.params
    const loginUser = getUser(req)
    const { sentFriendsRequest, friends } = loginUser

    try {
      const user = await userService.getUserById(userId)

      if (!user) throw new CustomError(404, "該用戶不存在")
      const userObject = user.toObject()
      userObject._id = userObject._id.toString()

      delete userObject.password
      delete userObject.friends
      delete userObject.sentFriendsRequest
      delete userObject.getFriendsRequest
      delete userObject.isAdmin
      delete userObject.createdAt
      delete userObject.updatedAt
      delete userObject.__v

      userObject.status = {
        hasSentRequest: sentFriendsRequest.some(
          (invitation) => invitation._id === userObject._id
        ),
        isFriend: friends.some((friend) => friend._id === userObject._id),
        isLoginUser: loginUser._id === userObject._id,
      }

      // 如果status都不是已發送邀請/已經是朋友/是本人，則設定isDefault
      userObject.status.isDefault = !(
        userObject.status.hasSentRequest ||
        userObject.status.isFriend ||
        userObject.status.isLoginUser
      )
      return res.json({ status: "success", data: userObject })
    } catch (err) {
      console.error("API user-controller getUserAccount:", err)
      sendErrorResponse(res, err.status, err.message)
    }
  },
  sendFriendRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = getUser(req)._id

    try {
      //確認邀請對象不是自己
      if (friendId === userId)
        throw new CustomError(400, "不能傳送交友邀請給自己")

      //確認雙方存在
      const areBothUsersExist = await userService.checkBothUsersExist(
        friendId,
        userId
      )
      if (!areBothUsersExist)
        throw new CustomError(400, "One or both users not found.")

      const result = await userService.sendFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to send friend request!")
      }

      return res.json({
        status: "success",
        message: "friend request sent successfully.",
      })
    } catch (err) {
      console.error("sendFriendRequest:", err)
      sendErrorResponse(res, err.status, err.message)
    }
  },
  acceptRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = getUser(req)._id

    try {
      //確認接受邀請對象不是自己
      if (friendId === userId) throw new CustomError(400, "不能跟自己成為朋友")

      //確認雙方存在
      const areBothUsersExist = await userService.checkBothUsersExist(
        friendId,
        userId
      )
      if (!areBothUsersExist)
        throw new CustomError(400, "One or both users not found.")

      const result = await userService.acceptFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to accept friend request")
      }

      return res.json({
        status: "success",
        message: "friend request accept successfully.",
      })
    } catch (err) {
      console.error("acceptFriendRequest:", err)
      sendErrorResponse(res, err.status, err.message)
    }
  },
  cancelFriendRequest: async (req, res) => {
    const friendId = req.params.userId
    const userId = getUser(req)._id

    try {
      const result = await userService.cancelFriendRequest(friendId, userId)

      if (!result) {
        throw new CustomError(500, "fail to cancel friend request!")
      }

      return res.json({
        status: "success",
        message: "friend request cancel successfully.",
      })
    } catch (err) {
      console.error("cancelFriendRequest:", err)
      sendErrorResponse(res, err.status, err.message)
    }
  },
}

module.exports = userController
