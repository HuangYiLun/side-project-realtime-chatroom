const { getUser } = require("../helpers/auth-helper")
const chatroomService = require("../services/chatroom-services")
const messageService = require("../services/message-services")

const chatController = {
  getChatRooms: async (req, res, next) => {
    const partialName = "roomsList"
    try {
      const publicChatrooms = await chatroomService.getPublicChatroomNames()

      res.render("roomsList", { partialName, publicChatrooms })
    } catch (err) {
      next(err)
    }
  },
  getChatRoom: async (req, res, next) => {
    const partialName = "roomsList"
    const roomId = req.params.roomId

    try {
      const foundChatroom = await chatroomService.getChatroomById(roomId)
      const foundMessages = await messageService.getMessages(foundChatroom._id)

      res.render("room", {
        partialName,
        chatroom: foundChatroom,
        messages: foundMessages,
      })
    } catch (err) {
      next(err)
    }
  },
  getPrivateRooms: async (req, res, next) => {
    const partialName = "1on1"
    const currentId = getUser(req)._id
    try {
      const allPrivateChats = await chatroomService.getAllPrivateChats(
        currentId
      )

      res.render("1on1", { partialName, allPrivateChats })
    } catch (err) {
      next(err)
    }
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
      const messages = await messageService.getMessages(currentChat.chatId)

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
