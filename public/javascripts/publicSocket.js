//front is served on the same domain as server
const socket = io()

import { postMessage } from "./api/message.js"
import {
  emitWithRetry,
  appendChatMessage,
  previewImg,
  hidePreviewImg,
  updateUserList,
} from "./chatUtils.js"

const attachmentImg = document.getElementById("attachment-image")
const hideImgIcon = document.querySelector(".hide-image-icon")
const onlineNumber = document.getElementById("online-number")
const attachmentInput = document.getElementById("attachment")
const msgInput = document.getElementById("message-input")
const msgList = document.getElementById("message-list")
const userList = document.getElementById("users-list")
const chatForm = document.getElementById("chat-form")
const imgBox = document.querySelector(".image-box")
const roomId = chatForm.dataset.roomid

// 加入聊天室
if (roomId) {
  emitWithRetry(socket, "joinRoom", roomId)
} else {
  console.log("現在執行一次socket.js")
}

socket.on("usersList", (data) => {
  const users = data.users
  updateUserList(userList, users)
  onlineNumber.innerHTML = users.length
})

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  let msg = msgInput.value
  const file = attachmentInput.files[0]

  msg = msg.trim()

  // 沒有文字也沒有圖片
  if (!msg && !file) {
    return
  }

  const response = await postMessage(roomId, msg, file)
  const { message, attachment, time } = response

  socket.emit("message", {
    message,
    attachment,
    time,
  })

  // 清空input
  msgInput.value = ""
  hidePreviewImg(imgBox, attachmentInput)
})

socket.on("message", (data) => {
  const userId = chatForm.dataset.userid
  const { user, message, attachment, time } = data

  appendChatMessage(msgList, userId, user, message, attachment, time)
})

attachmentInput.addEventListener("change", (e) =>
  previewImg(e, imgBox, attachmentImg)
)

hideImgIcon.addEventListener("click", () =>
  hidePreviewImg(imgBox, attachmentInput)
)
