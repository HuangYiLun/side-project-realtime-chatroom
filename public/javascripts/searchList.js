
const searchForm = document.querySelector('.form-search')
const searchInput = document.querySelector('.input-search')
const searchList = document.querySelector('.search-list')

const BASE_URL = 'http://localhost:3000'
const SEARCH_URL = '/users/search?keyword='
let filterUsers = []

// 搜尋submit監聽器
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault()

  const keyword = searchInput.value
  let rawHTML = ''

  try {
    const response = await axios.get(BASE_URL + SEARCH_URL + keyword)
    filterUsers = response.data.users
    // 清空search-list
    searchList.innerHTML = ''

    rawHTML = renderSearchList(filterUsers)

    searchList.innerHTML = rawHTML

  } catch (err) {
    console.error('請求失敗', err)
    rawHTML = renderInvalidSearchList()
    searchList.innerHTML = rawHTML
  }
})

// 渲染搜尋結果
function renderSearchList(users) {
  let rawHTML = ''

  if (users.length > 0) {
    users.forEach(user => {
      rawHTML += `
        <li class="search-list-item d-flex align-items-center justify-content-between" data-id="${user._id}">
          <div class="search-user-avatar">
            <img class="search-user-avatar-img" src="${user.avatar}" data-bs-toggle="modal" data-bs-target="#show-modal"
              onerror="this.src=' https://i.imgur.com/VUhtTKV.png'">
          </div>
  
          <div class="search-user-name">
            <h4 class="search-user-name-h4" data-bs-toggle="modal" data-bs-target="#show-modal">${user.name}</h4>
          </div>
  
          <div class="add-friend-btn">
            <button class="btn btn-outline-info">
              <i class="fa-solid fa-heart-circle-plus"></i>Add Friend
            </button>
          </div>
        </li>
      `
    })
  } else {
    rawHTML = renderInvalidSearchList()
  }
  return rawHTML
}

// 渲染無效搜索
function renderInvalidSearchList() {
  let rawHTML = ''

  rawHTML += `
      <li class="search-list-item d-flex align-items-center justify-content-between">
        <h4 class="text-white">No matching results found</h4>
      </li>
  `
  return rawHTML
}

// show modal 點擊監聽器
searchList.addEventListener('click', function onSearchListClicked(e) {
  const target = e.target

  if (target.matches('.search-user-avatar-img') || target.matches('.search-user-name-h4')) {
    const userId = target.closest('.search-list-item').dataset.id
    const user = filterUsers.find(user => user._id == userId)

    if (user) {
      showModal(user)
    }
  }
})

// 渲染show modal資訊
function showModal(user) {
  const showUserIntroduction = document.querySelector('.show-user-introduction')
  const showUserName = document.querySelector('.show-user-name')
  const showUserAvatar = document.querySelector('.avatar-img')

  showUserAvatar.src = user.avatar
  showUserName.innerText = user.name
  showUserIntroduction.innerText = user.introduction
}











