const navNotification = document.querySelector(".nav-notification")
const notificationList = document.querySelector(".notification-list")

navNotification.addEventListener("click", (e) => {
  const isDisplay = notificationList.classList.contains("d-none")

  if (isDisplay) {
    notificationList.classList.remove("d-none")
  } else {
    notificationList.classList.add("d-none")
  }
})

