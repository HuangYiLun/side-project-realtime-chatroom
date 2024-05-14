import { socket, joinRoom, sendMessage } from "./socketManger.js"
import { showModal } from "./showModal.js"
import { postMessage } from "./api/message.js"
import { getUser } from "./api/users.js"
import { putAddFriendRequest, putCancelFriendRequest } from "./api/friends.js"
import {
  appendChatMessage,
  previewImg,
  hidePreviewImg,
  updateOnlineUserList,
} from "./chatUtils.js"
import {
  updateModalAddFriendButton,
  updateModalCancelFriendButton,
  postNotificationAndSend,
} from "./friendUtils.js"
import { showLoadingSpinner, hideLoadingSpinner } from "./loader.js"
import { handleError } from "./apiResponseHandler.js"

const onlineUsersList = document.getElementById("online-users-list")
const attachmentImg = document.getElementById("attachment-image")
const attachmentInput = document.getElementById("attachment")
const onlineNumber = document.getElementById("online-number")
const msgInput = document.getElementById("message-input")
const msgList = document.getElementById("message-list")
const chatForm = document.getElementById("chat-form")

const modalFriendBtn = document.querySelector(".modal-friend-btn")
const hideImgIcon = document.querySelector(".hide-image-icon")
const imgBox = document.querySelector(".image-box")

const roomId = chatForm ? chatForm.dataset.roomid : ""

// 自動滾動聊天列表底部
if (msgList) {
  // 等待內容加載，延遲滾動
  setTimeout(() => {
    msgList.scrollTop = msgList.scrollHeight
  }, 1000) // 延遲 1000 毫秒
}

// 加入聊天室
if (roomId) {
  joinRoom(roomId)
}

// 設置聊天室線上使用者列表
if (onlineUsersList) {
  onlineUsersList.addEventListener("click", handleOnlineUsersListClicked)

  socket.on("usersList", (data) => {
    const users = data.users
    updateOnlineUserList(onlineUsersList, users)
    onlineNumber.innerHTML = users.length
  })
}

// 點擊線上使用者顯示使用者訊息
async function handleOnlineUsersListClicked(e) {
  const target = e.target
  // 點擊list item avatar or name 顯示modal
  if (target.matches(".user-avatar-img, .user-name")) {
    const { id } = target.closest(".list-item").dataset
    try {
      const response = await getUser(id)
      const user = response.data
      const { name, email, avatar, introduction } = user
      const { hasSentRequest, isFriend, isLoginUser, isDefault } = user.status

      showModal(
        id,
        name,
        email,
        avatar,
        introduction,
        hasSentRequest,
        isFriend,
        isLoginUser,
        isDefault
      )
    } catch (err) {
      handleError(err)
    }
  }
}

// 接收socket傳來的message
socket.on("message", (data) => {
  const userId = chatForm.dataset.userid
  const { user, message, attachment, time } = data
  //顯示訊息
  appendChatMessage(msgList, userId, user, message, attachment, time)

  // 如果有 attachment，等待圖片加載，延遲滾動到底部
  if (attachment) {
    setTimeout(() => {
      msgList.scrollTop = msgList.scrollHeight
    }, 1000) // 延遲 1000 毫秒
  } else {
    // 如果没有 attachment，立即滾動到底部
    msgList.scrollTop = msgList.scrollHeight
  }
})

if (chatForm) {
  chatForm.addEventListener("submit", handleChatFormSumbit)
}

// 發送聊天訊息
async function handleChatFormSumbit(e) {
  e.preventDefault()
  const msg = msgInput.value.trim()
  const file = attachmentInput.files[0]

  // 沒有文字也沒有圖片
  if (!msg && !file) return
  showLoadingSpinner()
  try {
    const response = await postMessage(roomId, msg, file)
    const { message, attachment, time } = response.data
    // 透過socket傳送message
    sendMessage(message, attachment, time)
    // 清空input
    msgInput.value = ""
    attachmentInput.value = ""
    // 隱藏預覽圖片
    hidePreviewImg(imgBox, attachmentInput)
  } catch (err) {
    handleError(err)
  }
  hideLoadingSpinner()
}

// 顯示預覽圖片
if (attachmentInput) {
  attachmentInput.addEventListener("change", (e) =>
    previewImg(e, imgBox, attachmentImg)
  )
}

// 隱藏預覽圖片
if (hideImgIcon) {
  hideImgIcon.addEventListener("click", () => {
    attachmentInput.value = ""
    hidePreviewImg(imgBox, attachmentInput)
  })
}

if (modalFriendBtn) {
  modalFriendBtn.addEventListener("click", handleModalButtonClicked)
}

async function handleModalButtonClicked(e) {
  const target = e.target

  if (target.matches(".add-friend-btn, .cancel-friend-btn")) {
    const listId = target.dataset.id
    const listItem = document.getElementById(listId)

    if (!listItem) return

    const friendId = listItem.dataset.id

    const action = target.matches(".add-friend-btn") ? "add" : "cancel"

    await handleFriendRequest(friendId, action, target)
  }
}

async function handleFriendRequest(friendId, action, target) {
  try {
    const response =
      action === "add"
        ? await putAddFriendRequest(friendId)
        : await putCancelFriendRequest(friendId)

    if (response.status === "success") {
      if (action === "add") {
        const notificationType = "friendRequest"
        const redirectUrl = "/friends?type=received"
        postNotificationAndSend(friendId, notificationType, redirectUrl)
        updateModalCancelFriendButton(target, friendId)
      } else {
        updateModalAddFriendButton(target, friendId)
      }
    }
  } catch (err) {
    handleError(err)
  }
}
