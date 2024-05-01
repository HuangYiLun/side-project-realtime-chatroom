import { socket, joinRoom, sendMessage } from "./socketManger.js"
import { showModal } from "./showModal.js"
import { postMessage } from "./api/message.js"
import {
  appendChatMessage,
  previewImg,
  hidePreviewImg,
  updateOnlineUserList,
} from "./chatUtils.js"

const attachmentImg = document.getElementById("attachment-image")
const hideImgIcon = document.querySelector(".hide-image-icon")
const onlineNumber = document.getElementById("online-number")
const attachmentInput = document.getElementById("attachment")
const msgInput = document.getElementById("message-input")
const msgList = document.getElementById("message-list")
const onlineUsersList = document.getElementById("online-users-list")
const chatForm = document.getElementById("chat-form")
const imgBox = document.querySelector(".image-box")

const roomId = chatForm ? chatForm.dataset.roomid : ""

// 加入聊天室
if (roomId) {
  joinRoom(roomId)
}

if (onlineUsersList) {
  onlineUsersList.addEventListener("click", onOnlineUsersListClicked)

  socket.on("usersList", (data) => {
    const users = data.users
    updateOnlineUserList(onlineUsersList, users)
    onlineNumber.innerHTML = users.length
  })
}

if (msgList) {
  msgList.scrollTop = msgList.scrollHeight
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const msg = msgInput.value.trim()
  const file = attachmentInput.files[0]

  // 沒有文字也沒有圖片
  if (!msg && !file) return

  const response = await postMessage(roomId, msg, file)
  if (response.status !== "success") return

  const { message, attachment, time } = response.data

  // 透過socket傳送message
  sendMessage(message, attachment, time)

  // 清空input
  msgInput.value = ""

  // 隱藏預覽圖片
  hidePreviewImg(imgBox, attachmentInput)
})

// 接收socket傳來的message
socket.on("message", (data) => {
  const userId = chatForm.dataset.userid
  const { user, message, attachment, time } = data

  //顯示訊息
  appendChatMessage(msgList, userId, user, message, attachment, time)
})

// 顯示預覽圖片
attachmentInput.addEventListener("change", (e) =>
  previewImg(e, imgBox, attachmentImg)
)

// 隱藏預覽圖片
hideImgIcon.addEventListener("click", () =>
  hidePreviewImg(imgBox, attachmentInput)
)

async function onOnlineUsersListClicked(e) {
  const target = e.target
  // 點擊list item avatar or name 顯示modal
  if (target.matches(".user-avatar-img, .user-name")) {
    const {
      id,
      name,
      email,
      avatar,
      introduction,
    } = target.closest(".list-item").dataset

    showModal(
      id,
      name,
      email,
      avatar,
      introduction,
    )
  }
}
