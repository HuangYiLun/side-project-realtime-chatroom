const Chatroom = require("../models/chatroom")

const privateChatroomName = "1on1"

const processPrivateChat = (chatroom) => ({
  chatId: chatroom._id.toString(),
  receiverId: chatroom.members[0]._id.toString(),
  name: chatroom.members[0].name,
  email: chatroom.members[0].email,
  avatar: chatroom.members[0].avatar,
  introduction: chatroom.members[0].introduction,
})

//將取得的members id轉換為user資料
const populatePrivateOptions = (currentId) => ({
  path: "members",
  select: "_id email name avatar introduction",
  // members只選＿id不是currentId的
  match: { _id: { $ne: currentId } },
})

const chatroomService = {
  checkChatroomExistsById: async (chatroomId) => {
    const chatroomExist = await Chatroom.exists({ _id: chatroomId })
    return chatroomExist
  },
  findOrCreatePrivateChatroom: async (currentId, receivedId) => {
    // 查看聊天記錄
    const foundChatroom = await Chatroom.findOne({
      isPublic: false,
      members: { $all: [currentId, receivedId] },
    })
      .populate(populatePrivateOptions(currentId))
      .lean()

    if (foundChatroom) {
      const processedFoundChatroom = processPrivateChat(foundChatroom)

      return processedFoundChatroom
    } else {
      // 還沒聊天過則新增
      const newChatroom = await Chatroom.create({
        name: privateChatroomName,
        isPublic: false,
        members: [currentId, receivedId],
      })

      await newChatroom.populate(populatePrivateOptions(currentId))

      const processedNewChatroom = processPrivateChat(newChatroom)

      return processedNewChatroom
    }
  },
  getAllPrivateChats: async (currentId) => {
    // 搜尋包含currentId的所有私人聊天
    const foundPrivateChats = await Chatroom.find({
      isPublic: false,
      members: {
        $elemMatch: {
          $eq: currentId,
        },
      },
    })
      .populate(populatePrivateOptions(currentId))
      .lean()

    // 將資料處理成前端使用的格式
    const processedPrivateChats = foundPrivateChats.map((chat) =>
      processPrivateChat(chat)
    )

    return processedPrivateChats
  },
  findPrivateChatroom: async (currentId, receivedId) => {
    // 查看聊天記錄
    const foundChatroom = await Chatroom.findOne({
      isPublic: false,
      members: { $all: [currentId, receivedId] },
    })
      .populate(populatePrivateOptions(currentId))
      .lean()

    return foundChatroom
  },
  createPrivateChatroom: async (currentId, receivedId) => {
    const newChatroom = await Chatroom.create({
      name: privateChatroomName,
      isPublic: false,
      members: [currentId, receivedId],
    })

    return newChatroom
  },
}

module.exports = chatroomService
