// 引用通用函式
import { handleInput, handleConfirmPassword } from "./formValidation.js"

const inputConfirmPassword = document.querySelector('#confirmPassword')
const inputUploadImg = document.querySelector('.input-upload-img')
const inputIntroduction = document.querySelector('#introduction')
const editUserData = document.querySelector('#edit-user-data')
const inputPassword = document.querySelector('#password')
const avatarImg = document.querySelector('.avatar-img')
const btnSumbit = document.querySelector('#btn-submit')
const btnClose = document.querySelector('.btn-close')
const inputEmail = document.querySelector('#email')
const inputName = document.querySelector('#name')
const form = document.querySelector('#form')


// 取得url
const url = window.location.href
//使用正則表達式，匹配url中的userid
const matches = url.match(/\/users\/(\w+)/)

const userId = matches[1]


// 添加'click'取得資料庫最新使用者資料
editUserData.addEventListener('click', async () => {
  try {
    const res = await axios.get(`/api/users/${userId}`)
    if (res.data.status === 'success') {
      avatarImg.src = res.data.avatar
      inputName.placeholder = res.data.name
      inputEmail.placeholder = res.data.email
      inputIntroduction.value = res.data.introduction
    } else {
      throw new Error(res.data.messages)
    }
  } catch (err) {
    console.log('err', err)
  }
})


// 添加'change'事件監聽器 預覽上傳圖片
inputUploadImg.addEventListener('change', previewImg)
/**
 * 預覽上傳圖片
 * @param {Event} e - 事件對象
 */

function previewImg(e) {
  const file = e.target.files[0]
  // 圖片不存在
  if (!file) {
    return
  }
  // 上傳檔案不是圖片
  if (!file.type.startsWith('image/')) {
    alert('請選擇圖片檔案')
    e.target.value = ''
    return
  }
  // 檢查圖片檔大小是否超過10MB
  if (file.size > 10485760) {
    alert('上傳圖片檔案大小不能超過10MB')
    e.target.value = ''
    return
  }

  // 替換img圖片
  avatarImg.src = window.URL.createObjectURL(file)
  // 釋放記憶體
  avatarImg.onload = function () {
    URL.revokeObjectURL(avatarImg.src)
  }

}


// 觸發bootstrap前端form驗證
btnSumbit.addEventListener('click', function onSubmitClick() {
  form.classList.add('was-validated')
})
// form驗證不通過，阻止事件默認行為＆停止事件冒泡
form.addEventListener('submit', function onFormSubmit(e) {
  if (!form.checkValidity()) {
    e.preventDefault()
    e.stopPropagation()
  }
})

// 驗證input字數是否超過限制
handleInput(inputName, 20)
handleInput(inputPassword, 12)
handleInput(inputIntroduction, 160)

// Confirm Password
// 判斷密碼是否一致
handleConfirmPassword(inputPassword, inputConfirmPassword)