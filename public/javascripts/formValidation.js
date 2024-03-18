// 驗證input字數是否超過限制
export function handleInputCounter(input, maxlength) {
  input.addEventListener("keyup", function (e) {
    const target = e.target
    const counter = target.parentElement.lastElementChild
    // 顯示目前輸入字數
    counter.innerText = `${target.value.length}/${maxlength}`

    if (target.value.trim().length > maxlength || target.value.trim() == 0) {
      target.setCustomValidity("invalid")
    } else {
      target.setCustomValidity("")
    }
  })
}

// 判斷密碼是否一致
export function handleConfirmPassword(inputPassword, inputConfirmPassword) {
  inputConfirmPassword.addEventListener("keyup", function (e) {
    const target = e.target

    if (inputPassword.value !== inputConfirmPassword.value) {
      target.setCustomValidity("invalid")
    } else {
      target.setCustomValidity("")
    }
  })
}
