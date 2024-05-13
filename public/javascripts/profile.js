// 引用通用函式
import { handleInputCounter, handleConfirmPassword } from "./formValidation.js"
import { showLoadingSpinner, hideLoadingSpinner } from "./loader.js"
import { handleError, handleSuccess } from "./apiResponseHandler.js"
import { putUser } from "./api/users.js"

const confirmPasswordInput = document.getElementById("confirmPassword")
const introductionTextarea = document.getElementById("introduction")
const passwordInput = document.getElementById("password")
const sumbitBtn = document.getElementById("btn-submit")
const emailInput = document.getElementById("email")
const nameInput = document.getElementById("name")
const form = document.getElementById("form")

const avatarInput = document.getElementById("avatar")
const avatarImg = document.querySelector(".avatar-img")

// 添加'change'事件監聽器 預覽上傳圖片
avatarInput.addEventListener("change", previewImg)
/**
 * 預覽上傳圖片
 * @param {Event} e - 事件對象
 */

function previewImg(e) {
  const file = e.target.files[0]
  // 圖片不存在
  if (!file) return

  // 上傳檔案不是圖片
  if (!file.type.startsWith("image/")) {
    alert("請選擇圖片檔案")
    e.target.value = ""
    return
  }
  // 檢查圖片檔大小是否超過10MB
  if (file.size > 10485760) {
    alert("上傳圖片檔案大小不能超過10MB")
    e.target.value = ""
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
sumbitBtn.addEventListener("click", function onSubmitClick() {
  form.classList.add("was-validated")
})

// form驗證不通過，阻止事件默認行為＆停止事件冒泡
form.addEventListener("submit", async function onFormSubmit(e) {
  e.preventDefault()
  e.stopPropagation()

  if (!form.checkValidity()) return

  const avatar = avatarInput.files[0]
  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const confirmpassword = confirmPasswordInput.value.trim()
  const introduction = introductionTextarea.value.trim()

  showLoadingSpinner()
  try {
    const response = await putUser(
      avatar,
      name,
      email,
      password,
      confirmpassword,
      introduction
    )
    console.log("getedituser", response.data)
    hideLoadingSpinner()

    if (response.status === "success") {
      avatarInput.value = ""
      passwordInput.value = ""
      confirmPasswordInput.value = ""

      avatarImg.src = response.data.avatar
      nameInput.value = response.data.name
      emailInput.value = response.data.email
      introductionTextarea.value = response.data.introduction

      form.classList.remove("was-validated")

      handleSuccess(response.message)
    }
  } catch (err) {
    console.error("error", err)
    hideLoadingSpinner()
    handleError(err)
  }
})

// 驗證input字數是否超過限制
handleInputCounter(nameInput, 20)
handleInputCounter(passwordInput, 12)
handleInputCounter(introductionTextarea, 160)

// 判斷密碼是否一致
handleConfirmPassword(passwordInput, confirmPasswordInput)
