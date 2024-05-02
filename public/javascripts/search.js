import { showModal } from "./showModal.js"
import { postNotification } from "./api/notification.js"
import { sendNotification } from "./socketManger.js"
import { putAddFriendRequest, putCancelFriendRequest } from "./api/friends.js"

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

  // 點擊取消朋友邀請按鈕
  if (target.matches(".cancel-friend-btn")) {
    const listItem = target.closest(".search-list-item")
    handleCancelFriendRequest(listItem)
  }
}

async function handleAddFriendRequest(listItem) {
  const friendId = listItem.dataset.id
  const success = await sendFriendRequest(friendId)
  if (success) {
    postNotificationAndSend(friendId)
    updateCancelFriendButton(listItem, friendId)
  }
}

async function handleCancelFriendRequest(listItem) {
  const friendId = listItem.dataset.id
  const success = await cancelFriendRequest(friendId)
  if (success) {
    updateAddFriendButton(listItem, friendId)
  }
}

async function sendFriendRequest(friendId) {
  const putAddFriendResponse = await putAddFriendRequest(friendId)
  return putAddFriendResponse.status === "success"
}

async function cancelFriendRequest(friendId) {
  const putCancelFriendResponse = await putCancelFriendRequest(friendId)
  return putCancelFriendResponse.status === "success"
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

function updateCancelFriendButton(listItem, friendId) {
  const friendButton = listItem.querySelector(".friend-btn")
  listItem.dataset.hassentrequest = true
  listItem.dataset.isdefault = false
  friendButton.innerHTML = `
    <button class="btn btn-outline-warning cancel-friend-btn" data-id=${friendId}>
      <i class="fa-solid fa-heart-circle-plus"></i>Cancel Friend Request
    </button>
  `
}

function updateAddFriendButton(listItem, friendId) {
  const friendButton = listItem.querySelector(".friend-btn")
  listItem.dataset.hassentrequest = false
  listItem.dataset.isdefault = true
  friendButton.innerHTML = `
   <button class="btn btn-outline-info add-friend-btn" data-id=${friendId}>
      <i class="fa-solid fa-heart-circle-plus"></i>Add Friend
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
        updateCancelFriendButton(listItem, friendId)
        updateModalCancelFriendButton(target, friendId)
      }
    }
  }

  if (target.matches(".cancel-friend-btn")) {
    const listId = target.dataset.id
    const listItem = document.getElementById(listId)
    if (listItem) {
      const friendId = listItem.dataset.id
      const success = await cancelFriendRequest(friendId)
      if (success) {
        updateAddFriendButton(listItem, friendId)
        updateModalAddFriendButton(target, friendId)
      }
    }
  }
}

function updateModalCancelFriendButton(target, friendId) {
  const modalfriendButton = target.closest(".modal-friend-btn")
  modalfriendButton.innerHTML = `
    <button class="btn btn-outline-warning cancel-friend-btn" data-id=${friendId}>
      <i class="fa-solid fa-heart-circle-plus"></i>Cancel Friend Request
    </button> `
}

function updateModalAddFriendButton(target, friendId) {
  const modalfriendButton = target.closest(".modal-friend-btn")
  modalfriendButton.innerHTML = `
    <button class="btn btn-outline-info add-friend-btn" data-id=${friendId}>
      <i class="fa-solid fa-heart-circle-plus"></i>Add Friend
    </button> `
}
