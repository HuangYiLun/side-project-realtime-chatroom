function createElementWithClass(tagName, className) {
  const element = document.createElement(tagName)
  element.className = className
  return element
}

// 生成聊天室messages內容
export function appendChatMessage(
  list,
  oneselfId,
  user,
  message,
  attachment,
  time
) {
  const isSender = oneselfId == user.id

  const li = createElementWithClass(
    "li",
    isSender
      ? "d-flex justify-content-end align-items-end gap-3"
      : "d-flex justify-content-start align-items-end gap-3"
  )

  const div = createElementWithClass(
    "div",
    isSender
      ? "p-3 border-top-start-radius bg-primary max-w-70"
      : "p-3 border-top-end-radius bg-secondary bg-opacity-50 max-w-70"
  )

  if (attachment) {
    // 圖片內容
    const img = createElementWithClass("img", "h-100 w-100 object-cover")
    img.src = attachment
    img.alt = "msg_img"
    // 圖片容器
    const imgContainer = createElementWithClass(
      "div",
      "rounded-5 overflow-hidden mb-2"
    )
    // 放進容器
    imgContainer.appendChild(img)
    div.appendChild(imgContainer)
  }
  // 文字訊息
  if (message) {
    const msgParagraph = createElementWithClass(
      "p",
      "fw-normal text-white text-break"
    )
    msgParagraph.textContent = message

    div.appendChild(msgParagraph)
  }
  // 時間訊息
  const timeParagraph = createElementWithClass(
    "p",
    "fw-lighter text-white fs-sm text-end mb-0"
  )
  timeParagraph.textContent = time

  div.appendChild(timeParagraph)

  // 判斷發送者
  if (isSender) {
    li.appendChild(div)
  } else {
    // 生成對方頭像
    const avatarImg = createElementWithClass(
      "img",
      "h-40px w-40px rounded-circle"
    )
    avatarImg.src = user.avatar

    //加上對方姓名
    const nameParagraph = createElementWithClass(
      "p",
      "fw-semibold mb-1 text-danger"
    )
    nameParagraph.textContent = user.name
    div.insertBefore(nameParagraph, div.firstChild)

    li.appendChild(avatarImg)
    li.appendChild(div)
  }
  list.appendChild(li)

  // 滑到對話底部
  list.scrollTop = list.scrollHeight
}

// show 聊天室預覽圖片
export function previewImg(e, imgBox, attachmentImg) {
  const file = e.target.files[0]

  if (!file) return

  if (!file.type.startsWith("image/")) {
    alert("請選擇圖片檔案")
    e.target.value = ""
    return
  }

  if (file.size > 10485760) {
    alert("上傳圖片檔案大小不能超過10MB")
    e.target.value = ""
    return
  }

  // 設置圖片預覽src
  attachmentImg.src = window.URL.createObjectURL(file)
  attachmentImg.onload = function () {
    URL.revokeObjectURL(this.src)
  }

  // show圖片容器
  const imgBoxClassList = imgBox.classList

  if (imgBoxClassList.contains("d-none")) {
    imgBoxClassList.replace("d-none", "d-flex")
  }
}

// hide 聊天室預覽圖片
export function hidePreviewImg(imgBox, attachmentInput) {
  const imgBoxClassList = imgBox.classList

  if (imgBoxClassList.contains("d-flex")) {
    imgBoxClassList.replace("d-flex", "d-none")
    attachmentInput.src = ""
  }
}

// 更新public聊天室 online users
export function updateOnlineUserList(list, users) {
  list.innerHTML = ""
  users.forEach((user) => appendUser(list, user))
}

// 添加public聊天室 list item
function appendUser(list, user) {
  const li = document.createElement("li")
  li.className = "list-item d-flex align-items-center border-bottom pb-2 pt-2"
  li.id = user.id
  li.dataset.id = user.id

  const img = document.createElement("img")
  img.className = "user-avatar-img h-40px w-40px rounded-circle pointer"
  img.src = user.avatar
  img.dataset.bsToggle = "modal"
  img.dataset.bsTarget = "#show-modal"
  img.onerror = () => (img.src = "https://i.imgur.com/VUhtTKV.png")

  const div = document.createElement("div")
  div.className = "user-name flex-grow-1 ms-3 text-white-50 pointer"
  div.dataset.bsToggle = "modal"
  div.dataset.bsTarget = "#show-modal"
  div.textContent = user.name

  li.appendChild(img)
  li.appendChild(div)
  list.appendChild(li)
}

// 添加1on1聊天室 聊天對象
export function appendPrivateChat(list, chat, receiverId) {
  //創建外部li
  let li = document.createElement("li")

  // 判斷是否當前聊天對象
  if (chat.receiverId == receiverId) {
    li.className = "my-1 p-3 private-chat-list-item active"
  } else {
    li.className = "my-1 p-3 private-chat-list-item"
  }

  li.dataset.chatid = chat.chatId
  li.dataset.receiverid = chat.receiverId

  // 創建<a>標籤，並設置href屬性
  let a = document.createElement("a")
  a.className = "text-decoration-none"
  a.href = `/chatroom/private/${chat.receiverId}`

  //創建頭像跟名字容器
  let avatarAndNameContainer = document.createElement("div")
  avatarAndNameContainer.className =
    "d-flex align-items-center justify-content-center"

  //創建頭像img
  let img = document.createElement("img")
  img.className = "h-40px w-40px rounded-circle"
  img.src = chat.avatar

  //創建姓名container
  let nameContainer = document.createElement("div")
  nameContainer.className = "flex-grow-1 ms-3"

  //創建姓名p
  let p = document.createElement("p")
  p.className = "mb-0"
  p.textContent = chat.name

  //<li>添加姓名及頭像
  nameContainer.append(p)
  avatarAndNameContainer.append(img, nameContainer)

  // 將avatarAndNameContainer添加到<a>標籤中
  a.append(avatarAndNameContainer)

  // 將<a>標籤添加到<li>標籤中
  li.append(a)

  //添加<li>
  list.append(li)
}
