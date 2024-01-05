// 渲染show modal資訊
export function showModal(name, avatar, introduction) {
  const showUserIntroduction = document.querySelector('.show-user-introduction')
  const showUserName = document.querySelector('.show-user-name')
  const showUserAvatar = document.querySelector('.avatar-img')

  showUserAvatar.src = avatar
  showUserName.innerText = name
  showUserIntroduction.innerText = introduction
}