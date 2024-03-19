const tabContent = document.querySelector('.content')

tabContent.addEventListener('click', function onTabContentClicked(e) {
  const target = e.target

  if (target.matches(".user-avatar-img") || target.matches(".user-name-h4")) {
     const { name, avatar, introduction } = target.closest(".list-item").dataset
     showModal(name, avatar, introduction)
  }
})

// 渲染show modal資訊
function showModal(name, avatar, introduction) {
  const showUserIntroduction = document.querySelector('.show-user-introduction')
  const showUserName = document.querySelector('.show-user-name')
  const showUserAvatar = document.querySelector('.avatar-img')
  
  showUserAvatar.src = avatar
  showUserName.innerText = name
  showUserIntroduction.innerText = introduction
}
