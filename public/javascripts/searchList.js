import { showModal } from "./showModal.js"
const searchForm = document.querySelector('.form-search')
const searchInput = document.querySelector('.input-search')
const searchList = document.querySelector('.search-list')

const BASE_URL = 'http://localhost:3100'

searchForm.addEventListener('submit', function onSearchFormSubmited(e) {
  const inputValue = searchInput.value.trim()
  // 全是空白鍵則停止輸入
  if (!inputValue) {
    e.preventDefault()
  }
})

// showList 監聽器
searchList.addEventListener('click', function onSearchListClicked(e) {
  const target = e.target

    if (target.matches(".search-user-avatar-img") || target.matches(".user-name-h4")) {
      const { name, avatar, introduction } =
        target.closest(".search-list-item").dataset
      showModal(name, avatar, introduction)
    }

    if (target.matches('.add-friend-btn')) {
      addFriendRequest(target)
    }
})


//加入朋友
async function addFriendRequest(self) {
  const friendId = self.dataset.id

  const result = await axios.put(`${BASE_URL}/friends/${friendId}/send`)

  if (result.data.success) {
    renderFriendButton(self)
  }
}

function renderFriendButton(self) {
  const friendButton = self.closest('.friend-btn')
  friendButton.innerHTML = `
    <button class="btn btn-outline-secondary none-pointer-friend-btn">
      Add Friend
    </button>
  `
}












