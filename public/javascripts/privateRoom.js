import {
  getAllPrivateChats,
  getCurrentPrivateChat,
  searchPrivateChats,
} from "./api/chats.js"

const usersList = document.getElementById("users-list")
const searchPrivateChatsForm = document.getElementById(
  "search-private-chats-form"
)
const searchPrivateChatsInput = document.getElementById(
  "search-private-chats-input"
)

searchPrivateChatsInput.addEventListener("keyup", async function (e) {
  console.log('keyup active')
  // 使用event.key來檢查按下的鍵是否是Enter鍵
  if (e.key === "Enter") {
    console.log('enter key enter')
    let receiverId
    const inputValue = searchPrivateChatsInput.value.trim()

    // 獲取當前頁面的URL
    const url = window.location.href
    const urlObj = new URL(url)
    // 提取路徑
    const path = urlObj.pathname
    // 使用正則表達式匹配URL中的特定部分
    // 正則表達式 /([a-f0-9]+)$/ 用於匹配URL末尾的一串由十六進制字符（a-f或0-9）組成的字符串
    const match = path.match(/([a-f0-9]+)$/)

    if (match) {
      // 如果匹配成功，取得第一個匹配成功的字符串
      receiverId = match[1]
      console.log("receiverId", receiverId)
    }

    try {
      console.log("☘️☘️前端發出axios")
      const response = await searchPrivateChats(inputValue)
      const filterPrivateChats = response.data
      usersList.innerHTML = ""

      if (filterPrivateChats?.length > 0) {
        filterPrivateChats.forEach((chat) =>
          appendPrivateChat(usersList, chat, receiverId)
        )
      } else {
        usersList.innerHTML = `<p style="color:white">沒有符合的搜尋結果<p>`
      }
    } catch (err) {
      console.error(err)
      usersList.innerHTML = `<p style="color:red">資料庫錯誤，請稍後再試<<p>`
    }
  }
})

function appendPrivateChat(list, chat, receiverId) {
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
