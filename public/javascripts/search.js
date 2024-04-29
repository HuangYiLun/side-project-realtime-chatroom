import { showModal } from "./showModal.js"
import { postNotification } from "./api/notification.js"
import { sendNotification } from "./socketManger.js"
import { putAddFriendRequest } from "./api/friend.js"

const searchForm = document.querySelector(".form-search")
const searchInput = document.querySelector(".input-search")
const searchList = document.querySelector(".search-list")
const modalFriendBtn = document.querySelector(".modal-friend-btn")

searchForm.addEventListener("submit", onSearchFormSubmited)
searchList.addEventListener("click", onSearchListClicked)
modalFriendBtn.addEventListener("click", onModalButtonClicked)

function onSearchFormSubmited(e) {
  const inputValue = searchInput.value.trim()
  if (!inputValue) {
    e.preventDefault()
  }
}

async function onSearchListClicked(e) {
  const target = e.target
  // 點擊list item avatar or name 顯示modal
  if (target.matches(".search-user-avatar-img, .user-name-h4")) {
    const {
      id,
      name,
      email,
      avatar,
      introduction,
      hassentrequest,
      isfriend,
      isloginuser,
      isdefault,
    } = target.closest(".search-list-item").dataset

    showModal(
      id,
      name,
      email,
      avatar,
      introduction,
      hassentrequest === "true",
      isfriend === "true",
      isloginuser === "true",
      isdefault === "true"
    )
  }

  // 點擊加入朋友按鈕
  if (target.matches(".add-friend-btn")) {
    const listItem = target.closest(".search-list-item")
    handleAddFriendRequest(listItem)
  }
}

async function handleAddFriendRequest(listItem) {
  const friendId = listItem.dataset.id
  const success = await sendFriendRequest(friendId)
  if (success) {
    postNotificationAndSend(friendId)
    updateFriendButton(listItem)
  }
}

async function sendFriendRequest(friendId) {
  const putAddFriendResponse = await putAddFriendRequest(friendId)
  return putAddFriendResponse.status === "success"
}

async function postNotificationAndSend(friendId) {
  const notificationType = "friendRequest"
  const redirectUrl = "/friends?type=received"
  const postedNotificationResponse = await postNotification(
    friendId,
    notificationType,
    redirectUrl
  )
  if (postedNotificationResponse.status === "success") {
    sendNotification({ userId: friendId })
  }
}

function updateFriendButton(listItem) {
  const friendButton = listItem.querySelector(".friend-btn")
  listItem.dataset.hassentrequest = true
  listItem.dataset.isdefault = false
  friendButton.innerHTML = `
    <button class="btn btn-outline-secondary none-pointer-friend-btn">
      Add Friend
    </button>
  `
}

async function onModalButtonClicked(e) {
  const target = e.target
  if (target.matches(".add-friend-btn")) {
    const listId = target.dataset.id
    const listItem = document.getElementById(listId)
    if (listItem) {
      const friendId = listItem.dataset.id
      const success = await sendFriendRequest(friendId)
      if (success) {
        postNotificationAndSend(friendId)
        updateFriendButton(listItem)
        updateModalFriendButton(target)
      }
    }
  }
}

function updateModalFriendButton(target) {
  const modalfriendButton = target.closest(".modal-friend-btn")
  modalfriendButton.innerHTML = `
    <button class="btn btn-outline-secondary none-pointer-friend-btn">
      Add Friend
    </button> `
}
