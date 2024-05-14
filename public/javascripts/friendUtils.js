import { postNotification } from "./api/notification.js"
import { sendNotification } from "./socketManger.js"

export function updateModalCancelFriendButton(target, friendId) {
  const modalfriendButton = target.closest(".modal-friend-btn")
  modalfriendButton.innerHTML = `
    <button class="btn btn-outline-warning cancel-friend-btn" data-id=${friendId}>
      <i class="fa-solid fa-heart-circle-minus"></i>Delete Request
    </button> `
}

export function updateModalAddFriendButton(target, friendId) {
  const modalfriendButton = target.closest(".modal-friend-btn")
  modalfriendButton.innerHTML = `
    <button class="btn btn-outline-info add-friend-btn" data-id=${friendId}>
      <i class="fa-solid fa-heart-circle-plus"></i>Add Friend
    </button> `
}

export async function postNotificationAndSend(
  friendId,
  notificationType,
  redirectUrl
) {
  const postedNotificationResponse = await postNotification(
    friendId,
    notificationType,
    redirectUrl
  )
  if (postedNotificationResponse.status === "success") {
    sendNotification({ userId: friendId })
  }
}
