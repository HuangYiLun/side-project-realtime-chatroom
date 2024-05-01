const User = require("../models/user")
const mongoose = require("mongoose")
const { CustomError } = require("../helpers/error-response-helper")

const userService = {
  getUserById: async (userId) => {
    const user = await User.findById(userId).select(
      "email name avatar introduction"
    )
    return user
  },
  searchUsers: async (keyword, loginUser) => {
    const { sentFriendsRequest, friends } = loginUser

    const foundUsers = await User.find(
      {
        // 搜尋條件
        $or: [{ name: { $regex: keyword, $options: "i" } }, { email: keyword }],
        // 回傳資料欄位
      },
      { name: 1, email: 1, avatar: 1, introduction: 1 }
    ).sort({ name: 1 }) //降冪排序

    return foundUsers.map((user) => {
      // 轉換成普通的object
      const userObject = user.toObject()

      userObject._id = userObject._id.toString()

      // 判斷是否已發送邀請/已經是朋友/是本人
      userObject.status = {
        hasSentRequest: sentFriendsRequest.some(
          (invitation) => invitation._id === userObject._id
        ),
        isFriend: friends.some((friend) => friend._id === userObject._id),
        isLoginUser: loginUser._id === userObject._id,
      }
      // 如果status都不是已發送邀請/已經是朋友/是本人，則設定isDefault=true
      userObject.status.isDefault = !(
        userObject.status.hasSentRequest ||
        userObject.status.isFriend ||
        userObject.status.isLoginUser
      )
      return userObject
    })
  },
  checkBothUsersExist: async (friendId, userId) => {
    // 確認雙方存在
    const usersCount = await User.countDocuments({
      _id: { $in: [userId, friendId] },
    })
    return usersCount === 2
  },
  sendFriendRequest: async (friendId, userId) => {
    //開啟新的session
    const session = await mongoose.startSession()

    let bulkWriteResult

    try {
      //使用session執行all or noting
      await session.withTransaction(async () => {

        // 定義session中的操作
        const operations = [
          {
            updateOne: {
              filter: { _id: userId },
              update: { $push: { sentFriendsRequest: friendId } },
            },
          },
          {
            updateOne: {
              filter: { _id: friendId },
              update: { $push: { getFriendsRequest: userId } },
            },
          },
        ]

        // 使用 bulkWrite 執行操作
        bulkWriteResult = await User.bulkWrite(operations, {
          session,
        })

        // 檢查是否所有操作都成功
        if (bulkWriteResult.modifiedCount !== 2) {
          throw new CustomError(500, "One or more operations failed.")
        }
      })

      // 如果所有操作成功，返回成功訊息
      return bulkWriteResult
    } catch (err) {
      throw err
    } finally {
      // 關閉mongoose session
      session.endSession()
    }
  },
  acceptFriendRequest: async (friendId, userId) => {
    //開啟新的session
    const session = await mongoose.startSession()

    let bulkWriteResult

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
        bulkWriteResult = await User.bulkWrite(operations, {
          session,
        })

        // 檢查是否所有操作都成功
        if (bulkWriteResult.modifiedCount !== 2) {
          throw new CustomError(500, "One or more operations failed.")
        }
      })

      // 如果所有操作成功，返回成功訊息
      return bulkWriteResult
    } catch (err) {
      throw err
    } finally {
      // 關閉mongoose session
      session.endSession()
    }
  },
}

module.exports = userService
