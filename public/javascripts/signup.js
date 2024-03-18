// 引用通用函式
import { handleInputCounter, handleConfirmPassword } from "./formValidation.js"
//form validation from front-end
const form = document.querySelector('#form')
const btnSumbit = document.querySelector('#btn-submit')
const inputName = document.querySelector('#name')
const inputPassword = document.querySelector('#password')
const inputConfirmPassword = document.querySelector('#confirmPassword')

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
handleInputCounter(inputName, 20)
handleInputCounter(inputPassword, 12)

// 判斷密碼是否一致
handleConfirmPassword(inputPassword, inputConfirmPassword)

