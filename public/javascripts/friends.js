import { showModal } from "./showModal.js"
import { putAcceptFriendRequest } from "./api/friends.js"
import { postNotificationAndSend } from "./friendUtils.js"
import { handleError } from "./errorHandler.js"

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
    const friendId = listItem.dataset.id
    handleAcceptFriendRequest(friendId)
  }
}

async function handleAcceptFriendRequest(friendId) {
  try {
    const response = await putAcceptFriendRequest(friendId)

    if (response.status === "success") {
      const notificationType = "friendAccepted"
      const redirectUrl = "/friends"

      await postNotificationAndSend(friendId, notificationType, redirectUrl)

      location.reload()
    }
  } catch (err) {
    handleError(err)
  }
}

