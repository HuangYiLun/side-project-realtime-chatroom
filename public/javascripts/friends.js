import { postNotification } from "./api/notification.js"
import { sendNotification } from "./socketManger.js"
const friendsList = document.querySelector(".friends-list")
const tabContent = document.querySelector(".content")

const BASE_URL = "http://localhost:3100"
const NOTIFICATION_TYPE = "friendAccepted"

tabContent.addEventListener("click", handleTabContentClick)

function handleTabContentClick(e) {
  const target = e.target

  if (target.matches(".user-avatar-img") || target.matches(".user-name-h4")) {
    const { name, avatar, introduction } = target.closest(".list-item").dataset
    showModal(name, avatar, introduction)
  }
}

// 渲染show modal資訊
function showModal(name, avatar, introduction) {
  const showUserIntroduction = document.querySelector(".show-user-introduction")
  const showUserName = document.querySelector(".show-user-name")
  const showUserAvatar = document.querySelector(".avatar-img")

  showUserAvatar.src = avatar
  showUserName.innerText = name
  showUserIntroduction.innerText = introduction
}

friendsList.addEventListener("click", handleListItemClick)

function handleListItemClick(e) {
  const target = e.target

  if (target.matches(".accept-friend-btn")) {
    acceptFriendRequest(target, BASE_URL, NOTIFICATION_TYPE)
  }
}

async function acceptFriendRequest(buttonElement, baseUrl, notificationType) {
  const friendId = buttonElement.dataset.friendId
  const friendName = buttonElement.dataset.friendName
  const redirectUrl = "/friends"

  try {
    //接受朋友邀請
    const acceptResponse = await axios.put(
      `${baseUrl}/friends/${friendId}/accept`
    )

    //接受朋友邀請成功 發送成為朋友通知
    if (acceptResponse.data.status === "success") {
      const notificationResponse = await postNotification(
        friendId,
        friendName,
        notificationType,
        redirectUrl
      )

      sendNotification({ userId: friendId })

      //發送朋友通知成功，就重新整理頁面
      if (notificationResponse.status === "success") {
        location.reload()
      }
    }
  } catch (err) {
    console.error(
      "Error accepting friend request or sending notification:",
      err
    )
  }
}
