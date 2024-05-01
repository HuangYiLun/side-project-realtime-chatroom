import {
  deleteNotification,
  getNotifications,
  patchNotifications,
} from "./api/notification.js"
import { socket } from "./socketManger.js"

const notificationList = document.querySelector(".notification-list")
const notificationBtn = document.querySelector(".notification-button")
const unReadNotificationsBadge = document.querySelector(".badge")
const userId = notificationList.dataset.userid

let notifications = []
let unreadNotificationIds = []

if (socket) {
  socket.emit("newUser", userId)
}

socket.on("receiveNotification", () => {
  loadNotifications(notificationList)
})

document.addEventListener("DOMContentLoaded", () => {
  loadNotifications(notificationList)
})

// 載入notifications
async function loadNotifications(notificationList) {
  try {
    notifications = await fetchNotifications()

    unreadNotificationIds = notifications.reduce((acc, notification) => {
      if (!notification.isRead) {
        acc.push(notification._id)
      }
      return acc
    }, [])

    handleUnreadNotificationsBadge()
    renderNotifications(notifications, notificationList)
  } catch (err) {
    console.error("Failed to load notifications:", err)
    notificationList.innerHTML = ""
    notificationList.innerHTML = `<li class="notification d-flex align-items-center justify-content-center px-2 gap-2"><p style="color:red">資料庫錯誤，請稍後再試<p></li>`
  }
}

// 取得notificaions
async function fetchNotifications() {
  try {
    const response = await getNotifications()
    return response.data
  } catch (err) {
    console.error("Failed to fetch notifications:", err)
    throw err
  }
}

// 渲染notifications
function renderNotifications(notifications, notificationList) {
  notificationList.innerHTML = ""
  if (notifications?.length > 0) {
    appendNotificationTop(notificationList)
    notifications.forEach((notification) =>
      appendNotification(notificationList, notification)
    )
  } else {
    notificationList.innerHTML = `<li class="notification d-flex align-items-center justify-content-center px-2 gap-2"><p style="color:white">目前沒有通知<p></li>`
  }
}

// 顯示notification-list按鈕
notificationBtn.addEventListener("click", () => {
  notificationList.classList.toggle("d-none")
})

// 添加 notification read button list items
function appendNotificationTop(list) {
  const li = document.createElement("li")
  li.className = "notification notification-top"

  const button = document.createElement("button")
  button.className = "notification-read-button btn btn-secondary rounded-pill"
  button.textContent = "全部已讀"

  li.appendChild(button)
  list.appendChild(li)
}

// 添加notification list items
function appendNotification(list, notification) {
  // 創建<li>元素
  const li = document.createElement("li")
  li.className = notification.isRead
    ? "notification p-2 gap-2"
    : "notification unread p-2 gap-2"

  // 創建<a>元素，並設置 href 屬性
  const a = document.createElement("a")
  a.className = "gap-2"
  a.href = notification.redirectUrl

  // 創建圖片容器<div>元素
  const imgDiv = document.createElement("div")
  imgDiv.className = "img-notification h-40px w-40px"

  // 創建<img>元素
  const img = document.createElement("img")
  img.src = notification.fromUserId.avatar
  img.alt = ""

  // 將<img>元素插入到圖片容器<div>元素中
  imgDiv.appendChild(img)

  // 創建文字容器<div>元素
  const textDiv = document.createElement("div")
  textDiv.className = "text-notification"

  textDiv.innerHTML = `
    <div class="text">${notification.message}</div>
    <div class="time">${notification.createdAt}</div>
    <div class="delete-button" data-id="${notification._id}">
      <svg height="20" width="15" viewBox="0 0 384 512">
        <path fill="#ffffff" d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"></path>
      </svg>
    </div>
 `
  a.appendChild(imgDiv)
  a.appendChild(textDiv)
  li.appendChild(a)
  list.appendChild(li)
}

setupNotificationListListener(notificationList)

// 設置notificationList事件監聽器
function setupNotificationListListener(notificationList) {
  notificationList.addEventListener("click", async (e) => {
    if (e.target.closest(".delete-button")) {
      e.preventDefault()
      e.stopPropagation()

      const deleteNotificationId = e.target.closest(".delete-button").dataset.id
      try {
        const isDeleted = await deleteNotificationHandler(deleteNotificationId)

        if (isDeleted) {
          const notificationElement = e.target.closest(".notification")
          animateElementRemoval(notificationElement)
          notifications = notifications.filter(
            (notification) => notification._id !== deleteNotificationId
          )
          unreadNotificationIds = notifications.reduce((acc, notification) => {
            if (!notification.isRead) {
              acc.push(notification._id)
            }
            return acc
          }, [])
          handleUnreadNotificationsBadge()

          if (notifications.length === 0) {
            renderNotifications(notifications, notificationList)
          }
        }
      } catch (err) {
        console.error("Error deleting notification:", err)
      }
    }

    if (e.target.closest(".notification-read-button")) {
      try {
        const response = await patchNotifications(unreadNotificationIds)

        if ((response.status = "success")) {
          loadNotifications(notificationList)
        }
      } catch (err) {
        console.error("Failed to turn unreadNotifications to read:", err)
      }
    }
  })
}

// 移除notification動畫效果
function animateElementRemoval(element) {
  element.classList.add("deleting")
  setTimeout(() => element.remove(), 500)
}

// 刪除notification
async function deleteNotificationHandler(notificationId) {
  try {
    const response = await deleteNotification(notificationId)
    return response.status === "success"
  } catch (err) {
    console.error("deleteNotificationError", err)
    return false
  }
}

// 控制unreadNotification紅點
function handleUnreadNotificationsBadge() {
  unReadNotificationsBadge.style.display =
    unreadNotificationIds.length === 0 ? "none" : "inline-block"
}
