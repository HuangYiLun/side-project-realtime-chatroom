import { showModal } from "./showModal.js"
import {
  postNotificationAndSend,
  updateModalAddFriendButton,
  updateModalCancelFriendButton,
} from "./friendUtils.js"
import { putAddFriendRequest, putCancelFriendRequest } from "./api/friends.js"
import { handleError } from "./errorHandler.js"

const searchForm = document.querySelector(".form-search")
const searchInput = document.querySelector(".input-search")
const searchList = document.querySelector(".search-list")
const modalFriendBtn = document.querySelector(".modal-friend-btn")

searchForm.addEventListener("submit", handleSearchFormSubmited)
searchList.addEventListener("click", handleSearchListClicked)
modalFriendBtn.addEventListener("click", handleModalButtonClicked)

function handleSearchFormSubmited(e) {
  const inputValue = searchInput.value.trim()
  if (!inputValue) {
    e.preventDefault()
  }
}

async function handleSearchListClicked(e) {
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

  // 點擊加入朋友/取消邀請按鈕
  if (target.matches(".add-friend-btn, .cancel-friend-btn")) {
    const listItem = target.closest(".search-list-item")
    if (!listItem) return

    const friendId = listItem.dataset.id

    const action = target.matches(".add-friend-btn") ? "add" : "cancel"

    await handleFriendRequest(friendId, action, listItem)
  }
}

async function handleFriendRequest(friendId, action, listItem) {
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
        updateCancelFriendButton(listItem, friendId)
      } else {
        updateAddFriendButton(listItem, friendId)
      }
    }
  } catch (err) {
    handleError(err)
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

async function handleModalButtonClicked(e) {
  const target = e.target

  if (target.matches(".add-friend-btn, .cancel-friend-btn")) {
    const listId = target.dataset.id
    const listItem = document.getElementById(listId)

    if (!listItem) return

    const friendId = listItem.dataset.id

    const action = target.matches(".add-friend-btn") ? "add" : "cancel"

    await handleModalFriendRequest(friendId, action, target, listItem)
  }
}

async function handleModalFriendRequest(friendId, action, target, listItem) {
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
        updateCancelFriendButton(listItem, friendId)
        updateModalCancelFriendButton(target, friendId)
      } else {
        updateAddFriendButton(listItem, friendId)
        updateModalAddFriendButton(target, friendId)
      }
    }
  } catch (err) {
    handleError(err)
  }
}
