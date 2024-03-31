//front is served on the same domain as server
const socket = io()

import { postMessage } from "./api/message.js"
import { appendChatMessage, previewImg, hidePreviewImg } from "./chatUtils.js"

const attachmentImg = document.getElementById("attachment-image")
const hideImgIcon = document.querySelector(".hide-image-icon")
const attachmentInput = document.getElementById("attachment")
const msgInput = document.getElementById("message-input")
const msgList = document.getElementById("message-list")
const chatForm = document.getElementById("chat-form")
const imgBox = document.querySelector(".image-box")
const roomId = chatForm.dataset.roomid

// 加入聊天室
if (roomId) {
  emitWithRetry(socket, "joinRoom", roomId)
} else {
  console.log("現在執行一次socket.js")
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  let msg = msgInput.value
  msg = msg.trim()

  const file = attachmentInput.files[0]

  // 沒有文字也沒有圖片
  if (!msg && !file) {
    return
  }
  //對server發送post req將message儲存到資料庫
  const response = await postMessage(roomId, msg, file)

  const { message, attachment, time } = response

  // 透過socket傳送message
  socket.emit("message", {
    message,
    attachment,
    time,
  })

  // 清空input
  msgInput.value = ""
  hidePreviewImg(imgBox, attachmentInput)
})

// 收到server message
socket.on("message", (data) => {
  const userId = chatForm.dataset.userid
  const { user, message, attachment, time } = data
  appendChatMessage(msgList, userId, user, message, attachment, time)
})

function emitWithRetry(socket, event, room) {
  socket.emit(event, room, (response) => {
    console.log("EmitWithRetry", response)
    if (response === "success") {
      console.log("Joined Room Successfully")
    } else {
      // 沒有回應則重試
      console.log("Response", response)
      console.log("Retry Emit JoinRoom!!")
      emitWithRetry(socket, event, room)
    }
  })
}

attachmentInput.addEventListener("change", (e) =>
  previewImg(e, imgBox, attachmentImg)
)

hideImgIcon.addEventListener("click", () =>
  hidePreviewImg(imgBox, attachmentInput)
)
