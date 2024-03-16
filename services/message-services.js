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
}

module.exports = messageServices
