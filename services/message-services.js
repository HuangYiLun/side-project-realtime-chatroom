const Message = require("../models/message")
const { imgurFileHelper } = require("../helpers/file-helper")

const messageServices = {
  postMessage: async (senderId, chatroomId, message, attachment) => {
    let attachmentUrl

    if (attachment) {
      attachmentUrl = await imgurFileHelper(attachment)
    }

    const createdMessage = await Message.create({
      senderId,
      chatroomId,
      message,
      attachment: attachmentUrl,
    })

    return {
      message: createdMessage.message,
      attachment: createdMessage.attachment,
      time: createdMessage.createdAt,
    }
  },
  getMessages: async (chatroomId) => {
    const foundMessages = await Message.find({
      chatroomId,
    })
      .populate({
        path: "senderId",
        select: "_id avatar name",
      })
      .lean()

    foundMessages.forEach((message) => {
      message.senderId._id = message.senderId._id.toString()
    })

    return foundMessages
  },
}

module.exports = messageServices
