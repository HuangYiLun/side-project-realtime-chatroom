const Chatroom = require("../models/chatroom")
const Message = require("../models/message")

const chatController = {
  getChatRooms: async (req, res, next) => {
    const partialName = "roomsList"

    const foundPublicChatrooms = await Chatroom.find(
      { isPublic: true },
      { name: 1 }
    )
    const publicChatrooms = foundPublicChatrooms.map((chatroom) =>
      chatroom.toObject()
    )

    res.render("roomsList", { partialName, publicChatrooms })
  },
  getChatRoom: async (req, res, next) => {
    const partialName = "room"
    const roomId = req.params.roomId
    const foundChatroom = await Chatroom.findById(roomId, { name: 1 }).lean()
    const foundMessages = await Message.find({
      chatroomId: foundChatroom._id,
    })
      .populate({
        path: "senderId",
        select: "_id avatar name",
      })
      .lean()

    foundMessages.forEach((message) => {
      message.senderId._id = message.senderId._id.toString()
    })

    console.log("foundMessages", foundMessages)

    res.render("room", {
      partialName,
      chatroom: foundChatroom,
      messages: foundMessages,
    })
  },
  getPrivateRoom: (req, res, next) => {
    const partialName = "1on1"
    res.render("1on1", { partialName })
  },
}

module.exports = chatController
