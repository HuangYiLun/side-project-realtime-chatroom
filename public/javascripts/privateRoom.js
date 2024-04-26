import { searchPrivateChats } from "./api/chats.js"
import { appendPrivateChat } from "./chatUtils.js"

const privateChatroomsList = document.getElementById("private-chatrooms-list")

const searchPrivateChatsInput = document.getElementById(
  "search-private-chats-input"
)

searchPrivateChatsInput.addEventListener("keyup", async function (e) {
  // 使用event.key來檢查按下的鍵是否是Enter鍵
  if (e.key === "Enter") {
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
    }

    try {
      const response = await searchPrivateChats(inputValue)
      const filterPrivateChats = response.data
      privateChatroomsList.innerHTML = ""

      if (filterPrivateChats?.length > 0) {
        filterPrivateChats.forEach((chat) =>
          appendPrivateChat(privateChatroomsList, chat, receiverId)
        )
      } else {
        privateChatroomsList.innerHTML = `<p style="color:white">沒有符合的搜尋結果<p>`
      }
    } catch (err) {
      console.error(err)
      privateChatroomsList.innerHTML = `<p style="color:red">資料庫錯誤，請稍後再試<<p>`
    }
  }
})

