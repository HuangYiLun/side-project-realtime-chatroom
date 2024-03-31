const Chatroom = require("../models/chatroom")
const Message = require("../models/message")
const { getUser } = require("../helpers/auth-helper")
const chatroomService = require("../services/chatroom-services")
const messageServices = require("../services/message-services")

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

    res.render("room", {
      partialName,
      chatroom: foundChatroom,
      messages: foundMessages,
    })
  },
  getPrivateRooms: async (req, res, next) => {
    const partialName = "1on1"
    const currentId = getUser(req)._id

    const allPrivateChats = await chatroomService.getAllPrivateChats(currentId)

    res.render("1on1", { partialName, allPrivateChats })
  },
  getPrivateRoom: async (req, res, next) => {
    const partialName = "1on1"
    const currentId = getUser(req)._id
    const { receivedId } = req.params

    // 無法跟自己聊天
    if (currentId === receivedId) {
      req.flash("danger_msg", "你無法跟自己聊天")
      return res.redirect("back")
    }

    try {
      const currentChat = await chatroomService.findOrCreatePrivateChatroom(
        currentId,
        receivedId
      )
      const allPrivateChats = await chatroomService.getAllPrivateChats(
        currentId
      )
      const messages = await messageServices.getMessages(currentChat.chatId)

      return res.render("1on1", {
        partialName,
        currentChat,
        messages,
        allPrivateChats,
      })
    } catch (err) {
      next(err)
    }
  },
  postPrivateRoom: async (req, res, next) => {
    console.log("enter post room")
    console.log("req.body", req.body)
    const currentId = getUser(req)._id
    // 選擇要聊天的朋友id
    const { selectedFriendId } = req.body
    try {
      const existingPrivateChatroom = await chatroomService.findPrivateChatroom(
        currentId,
        selectedFriendId
      )

      if (existingPrivateChatroom) {
        req.flash("danger_msg", "已經創建過聊天室")
      } else {
        await chatroomService.createPrivateChatroom(currentId, selectedFriendId)
        req.flash("success_msg", "新增聊天室成功")
      }
      return res.redirect("back")
    } catch (err) {
      next(err)
    }
  },
}

module.exports = chatController
