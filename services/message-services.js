const Message = require("../models/message")
const { imgurFileHelper } = require("../helpers/file-helper")

const messageServices = {
  postMessage: async (senderId, chatroomId, message, attachment) => {
    let attachmentUrl

    if (attachment) {
      attachmentUrl = await imgurFileHelper(attachment)
    }

    const msg = await Message.create({
      senderId,
      chatroomId,
      message,
      attachment: attachmentUrl,
    }).then((doc) => ({
      message: doc.message,
      attachment: doc.attachment,
      time: doc.createdAt,
    }))

    return msg
  },
  getMessages: async (chatroomId) => {
    const foundMessages = await Message.find({
      chatroomId
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
