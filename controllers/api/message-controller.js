const { getUser } = require("../../helpers/auth-helper")
const messageService = require("../../services/message-services")
const chatroomService = require("../../services/chatroom-services")
const {
  sendErrorResponse,
  CustomError,
} = require("../../helpers/error-response-helper")

const messageController = {
  postMessage: async (req, res) => {
    const { chatroomId, message } = req.body
    const attachment = req.file
    const loginUser = getUser(req)
    const senderId = loginUser._id

    try {
      if (!chatroomId) throw new CustomError(400, "Missing chatroom id!")
      // 檢查 message 和 attachment 是否都不存在
      if (!message && !attachment) throw new CustomError(400, "Empty message")

      const chatroomExists = chatroomService.checkChatroomExistsById(chatroomId)
      if (!chatroomExists) throw new CustomError(404, "chatroom didn't exist!")

      const msg = await messageService.postMessage(
        senderId,
        chatroomId,
        message,
        attachment
      )

      res.status(200).json({ status: "success", data: msg })
    } catch (err) {
      console.error("API_MESSAGE_CONTROLLER postMessage:", err)
      sendErrorResponse(res, err.status, err.message)
    }
  },
}

module.exports = messageController
