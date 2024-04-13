const notificationList = document.querySelector(".notification-list")
const notificationBtn = document.querySelector(".notification-button")
import { deleteNotification, getNotifications } from "./api/notification.js"

notificationList.addEventListener("click", async function (e) {
  if (e.target.closest(".delete-button")) {
    e.preventDefault()
    e.stopPropagation()

    const deleteNotificationId = e.target.closest(".delete-button").dataset.id

    try {
      const response = await deleteNotification(deleteNotificationId)

      if (response.status === "success") {
        const notificationElement = e.target.closest(".notification")
        notificationElement.classList.add("deleting")
        setTimeout(() => {
          notificationElement.remove()
        }, 500)
      }
    } catch (err) {
      console.error("deleteNotificationError", err)
    }
  }
})

try {
  const response = await getNotifications()
  const notifications = response.data
  console.log("notifications", notifications)
  notificationList.innerHTML = ""

  if (notifications?.length > 0) {
    notifications.forEach((notification) =>
      appendNotification(notificationList, notification)
    )
  } else {
    notificationList.innerHTML = `<li class="px-2 gap-2"><p style="color:white">目前沒有通知<p></li>`
  }
} catch (err) {
  console.error(err)
  notificationList.innerHTML = `<li class="px-2 gap-2"><p style="color:red">資料庫錯誤，請稍後再試<<p></li>`
}

notificationBtn.addEventListener("click", (e) => {
  const isDisplay = notificationList.classList.contains("d-none")

  if (isDisplay) {
    notificationList.classList.remove("d-none")
  } else {
    notificationList.classList.add("d-none")
  }
})

function appendNotification(list, notification) {
  // 創建<li>元素
  const li = document.createElement("li")
  li.className = "notification p-2 gap-2"

  // 創建<a>元素，並設置 href 屬性
  const link = document.createElement("a")
  link.className = "gap-2"
  link.href = "/friends?type=received"

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

  // 創建文字<div>元素
  const text = document.createElement("div")
  text.className = "text"
  text.textContent = notification.message

  // 創建時間<div>元素
  const time = document.createElement("div")
  time.className = "time"
  time.textContent = notification.createdAt

  // 創建刪除按鈕<div>元素
  const deleteBtn = document.createElement("div")
  deleteBtn.className = "delete-button"
  deleteBtn.dataset.id = notification._id

  // 創建刪除按鈕的 SVG 元素
  const deleteSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  )
  deleteSvg.setAttribute("height", "20")
  deleteSvg.setAttribute("width", "15")
  deleteSvg.setAttribute("viewBox", "0 0 384 512")

  const deletePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  )
  deletePath.setAttribute("fill", "#ffffff")
  deletePath.setAttribute(
    "d",
    "M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"
  )

  deleteSvg.appendChild(deletePath)
  deleteBtn.appendChild(deleteSvg)

  // 將文字和時間<div>元素插入到文字容器<div>元素中
  textDiv.appendChild(text)
  textDiv.appendChild(time)
  textDiv.appendChild(deleteBtn)

  // 將圖片容器<div>元素和文字容器<div>元素插入到<a>元素中
  link.appendChild(imgDiv)
  link.appendChild(textDiv)

  li.appendChild(link)

  // 將<li>元素插入到容器元素中
  list.appendChild(li)
}
