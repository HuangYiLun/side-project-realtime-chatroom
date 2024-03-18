//front is served on the same domain as server
const socket = io()


import { postMessage } from "./api/message.js"
const roomName = document.getElementById("room-name")
const onlineNumber = document.getElementById("online-number")
const userList = document.getElementById("users-list")
const chatForm = document.getElementById("chat-form")
const msgList = document.getElementById("message-list")
const msgInput = document.getElementById("message-input")
const attachmentInput = document.getElementById("attachment")
const attachmentImg = document.getElementById("attachment-image")
const imgBox = document.querySelector(".image-box")
const hideImgIcon = document.querySelector(".hide-image-icon")

// 加入聊天室
if (roomName) {
  emitWithRetry(socket, "joinRoom", roomName.textContent)
} else {
  console.log("現在執行一次socket.js")
}

// console.log("有發送joinroom", roomName.textContent);
socket.on("usersList", (data) => {
  const users = data.users
  updateUserList(users)
  onlineNumber.innerHTML = users.length
})

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  let msg = msgInput.value
  const file = attachmentInput.files[0]
  const roomId = chatForm.dataset.roomid

  msg = msg.trim()

  // 沒有文字也沒有圖片
  if (!msg && !file) {
    return
  }

  const response = await postMessage(roomId, msg, file)
  const{message,attachment,time} = response
  socket.emit("message", {
    message,
    attachment,
    time,
  })

  // 清空input
  msgInput.value = ""
  attachmentInput.value = ""
})

socket.on("message", (data) => {
  const userId = chatForm.dataset.userid
  console.log("frontend msg", data)
  const { user, message, attachment, time } = data
  appendChatMessage(userId, user, message, attachment, time)
})

attachmentInput.addEventListener("change", previewImg)
hideImgIcon.addEventListener("click", hidePreviewImg)

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

function updateUserList(users) {
  userList.innerHTML = ""
  users.forEach((user) => appendUser(user))
}

function appendUser(user) {
  const li = document.createElement("li")
  li.className = "d-flex align-items-center border-bottom pb-2 pt-2"

  const img = document.createElement("img")
  img.className = "h-40px w-40px rounded-circle"
  img.src = user.avatar
  img.dataset.bsToggle = "modal"
  img.dataset.bsTarget = "#show-modal"
  img.onerror = () => (img.src = "https://i.imgur.com/VUhtTKV.png")

  const div = document.createElement("div")
  div.className = "flex-grow-1 ms-3 text-white-50"
  div.textContent = user.name

  li.appendChild(img)
  li.appendChild(div)
  userList.appendChild(li)
}

function createElementWithClass(tagName, className) {
  const element = document.createElement(tagName)
  element.className = className
  return element
}

// 生成聊天室messages內容
function appendChatMessage(oneselfId, user, message, attachment, time) {
  const isSender = oneselfId == user.id

  const li = createElementWithClass(
    "li",
    isSender
      ? "d-flex justify-content-end align-items-end gap-3"
      : "d-flex justify-content-start align-items-end gap-3"
  )

  const div = createElementWithClass(
    "div",
    isSender
      ? "p-3 border-top-start-radius bg-primary max-w-70"
      : "p-3 border-top-end-radius bg-secondary bg-opacity-50 max-w-70"
  )

  if (attachment) {
    // 圖片內容
    const img = createElementWithClass("img", "h-100 w-100 object-cover")
    img.src = attachment
    img.alt = "msg_img"
    // 圖片容器
    const imgContainer = createElementWithClass(
      "div",
      "rounded-5 overflow-hidden mb-2"
    )
    // 放進容器
    imgContainer.appendChild(img)
    div.appendChild(imgContainer)
  }
  // 文字訊息
  if (message) {
    const msgParagraph = createElementWithClass(
      "p",
      "fw-normal text-white text-break"
    )
    msgParagraph.textContent = message

    div.appendChild(msgParagraph)
  }
  // 時間訊息
  const timeParagraph = createElementWithClass(
    "p",
    "fw-lighter text-white fs-sm text-end mb-0"
  )
  timeParagraph.textContent = time

  div.appendChild(timeParagraph)

  // 判斷發送者
  if (isSender) {
    li.appendChild(div)
  } else {
    // 生成對方頭像
    const avatarImg = createElementWithClass(
      "img",
      "h-40px w-40px rounded-circle"
    )
    avatarImg.src = user.avatar

    //加上對方姓名
    const nameParagraph = createElementWithClass(
      "p",
      "fw-semibold mb-1 text-danger"
    )
    nameParagraph.textContent = user.name
    div.insertBefore(nameParagraph, div.firstChild)

    li.appendChild(avatarImg)
    li.appendChild(div)
  }
  msgList.appendChild(li)
  // 滑到對話底部
  msgList.scrollTop = msgList.scrollHeight
}

function previewImg(e) {
  const file = e.target.files[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith("image/")) {
    alert("請選擇圖片檔案")
    e.target.value = ""
    return
  }

  if (file.size > 10485760) {
    alert("上傳圖片檔案大小不能超過10MB")
    e.target.value = ""
    return
  }

  attachmentImg.src = window.URL.createObjectURL(file)
  attachmentImg.onload = function () {
    URL.revokeObjectURL(this.src)
  }
  showImgBox()
}

function showImgBox() {
  const imgBoxClassList = imgBox.classList
  console.log("contains d-none", imgBoxClassList.contains("d-none"))
  if (imgBoxClassList.contains("d-none")) {
    imgBoxClassList.replace("d-none", "d-flex")
  }
}

function hidePreviewImg() {
  const imgBoxClassList = imgBox.classList
  console.log("contains d-flex", imgBoxClassList.contains("d-flex"))
  if (imgBoxClassList.contains("d-flex")) {
    imgBoxClassList.replace("d-flex", "d-none")
    attachmentInput.value = ""
  }
}
