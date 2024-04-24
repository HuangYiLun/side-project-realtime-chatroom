const User = require("../models/user")
const formatTime = require("../utilities/formatTime")

// 記錄上線users
let onlineUsers = []

// 記錄聊天室users
const usersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray
  },
}

module.exports = (io) => {
  io.on("connection", async (socket) => {

    socket.on("newUser", (userId) => {
      console.log(`${userId} add online users`)
      addOnlineUser(userId, socket.id)
      console.log("onlineusers", onlineUsers)
    })

    socket.on("sendNotification", (data) => {
      console.log("on send notification", data)
      console.log("data", data)
      const user = getOnlineUser(data.userId)
      console.log("onlineuser", user)
      socket.to(user.socketId).emit("receiveNotification", data)
    })

    const activeUser = socket.request.user
    console.log(`User ${activeUser.name} connected`)

    socket.on("joinRoom", (room) => {
      console.log("enter joinroom")
      console.log('room',room)
      socket.join(room)
      console.log(`${activeUser.name} joined room ${room}`)

      // 檢查是否已在usersState中
      const prevUser = getUser(activeUser._id)

      // 離開前一個聊天室
      if (prevUser) {
        const prevRoom = prevUser.room

        if (prevRoom) {
          socket.leave(prevRoom)
          console.log(`${activeUser.name} left room ${prevRoom} on join room`)
        }
      }
      // 更新usersState中的users
      const user = userJoinRoom(
        activeUser._id,
        activeUser.name,
        activeUser.avatar,
        activeUser.introduction,
        room
      )
      // 給前聊天室發送users列表
      if (prevUser) {
        const prevRoom = prevUser.room

        if (prevRoom) {
          io.to(prevRoom).emit("usersList", {
            users: getRoomUsers(prevRoom),
          })
        }
      }
      // 給現在聊天室所有users發送users-list
      io.to(user.room).emit("usersList", {
        users: getRoomUsers(user.room),
      })
    })

    socket.on("message", async (data) => {
      const { message, attachment, time } = data

      const user = getUser(activeUser._id)

      // 給現在聊天室所有users發送message
      io.to(user.room).emit(
        "message",
        buildMsg(user, message, attachment, time)
      )
    })

    // 中斷聊天室連線
    socket.on("disconnect", () => {
      console.log("enter disconnect")
      removeOnlineUser(socket.id)

      const user = getUser(activeUser._id)

      if (user) {
        userLeaveRoom(user.id)
        io.to(user.room).emit("usersList", {
          users: getRoomUsers(user.room),
        })
        console.log(`${user.name} has left room ${user.room} on disconnect`)
      }
    })
  })
}

// 加入聊天室
function userJoinRoom(id, name, avatar, introduction, room) {
  const user = { id, name, avatar, introduction, room }
  usersState.setUsers([
    ...usersState.users.filter((user) => user.id !== id),
    user,
  ])
  return user
}
// 離開聊天室
function userLeaveRoom(id) {
  usersState.setUsers(usersState.users.filter((user) => user.id !== id))
}
// 取得聊天室users
function getRoomUsers(room) {
  return usersState.users.filter((user) => user.room === room)
}
// 查詢聊天室user
function getUser(id) {
  return usersState.users.find((user) => user.id === id)
}

// 加入onlineUsers
function addOnlineUser(userId, socketId) {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId })
}

// 離開onlineUsers
function removeOnlineUser(socketId) {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId)
  console.log("removeonlineusers", onlineUsers)
}

// 查詢上線user
function getOnlineUser(userId) {
  return onlineUsers.find((user) => user.userId === userId)
}

// 建立聊天訊息
function buildMsg(user, message, attachment, time) {
  return {
    user,
    message,
    attachment,
    time: formatTime(time),
  }
}
