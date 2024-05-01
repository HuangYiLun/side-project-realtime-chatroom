import { postNotification } from "./api/notification.js"
import { sendNotification } from "./socketManger.js"
import { showModal } from "./showModal.js"
import {putAcceptFriendRequest} from "./api/friends.js"
const tabContent = document.querySelector(".content")

tabContent.addEventListener("click", handleTabContentClick)

function handleTabContentClick(e) {
  const target = e.target

  if (target.matches(".user-avatar-img, .user-name-h4")) {
    const { id, name, email, avatar, introduction } =
      target.closest(".list-item").dataset
    showModal(id, name, email, avatar, introduction)
  }

  if (target.matches(".accept-friend-btn")) {
    const listItem = target.closest(".list-item")
    handleAcceptFriendRequest(listItem)
  }
}

async function handleAcceptFriendRequest(listItem) {
  const friendId = listItem.dataset.id
  const success = await acceptFriendRequest(friendId)
  if (success) {
    postNotificationAndSend(friendId)
    location.reload()
  }
}

async function postNotificationAndSend(friendId) {
  const notificationType = "friendAccepted"
  const redirectUrl = "/friends"
  const postedNotificationResponse = await postNotification(
    friendId,
    notificationType,
    redirectUrl
  )
  if (postedNotificationResponse.status === "success") {
    sendNotification({ userId: friendId })
  }
}

async function acceptFriendRequest(friendId) {
  const putAcceptFriendResponse = await putAcceptFriendRequest(friendId)
  return putAcceptFriendResponse.status === "success"
}

