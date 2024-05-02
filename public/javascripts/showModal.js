// 渲染show modal資訊
export function showModal(
  id,
  name,
  email,
  avatar,
  introduction,
  hasSentRequest,
  isFriend,
  isLoginUser,
  isDefault
) {
  const showUserIntroduction = document.querySelector(".show-user-introduction")
  const showUserName = document.querySelector(".show-user-name")
  const showUserEmail = document.querySelector(".show-user-email")
  const showUserAvatar = document.querySelector(".avatar-img")
  const modalFriendBtn = document.querySelector(".modal-friend-btn")

  let rawHTML = ""

  if (hasSentRequest) {
    rawHTML = `
    <button class="btn btn-outline-warning cancel-friend-btn" data-id=${id}>
      <i class="fa-solid fa-heart-circle-plus"></i>Cancel Friend Request
    </button>`
  }
  if (isFriend) {
    rawHTML = `
    <button class="btn btn-outline-success none-pointer">
      Friend
    </button>`
  }
  if (isLoginUser) {
    rawHTML = `
    <button class="btn btn-outline-light none-pointer">
      Yourself
    </button>`
  }
  if (isDefault) {
    rawHTML = `
    <button class="btn btn-outline-info add-friend-btn" data-id=${id}>
      <i class="fa-solid fa-heart-circle-plus"></i>Add Friend
    </button>`
  }

  showUserAvatar.src = avatar
  showUserName.innerText = name
  showUserEmail.innerText = email
  showUserIntroduction.innerText = introduction
  modalFriendBtn.innerHTML = rawHTML
}
