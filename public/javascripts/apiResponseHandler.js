export function handleError(err) {
  const errorMessage = document.getElementById("success-error-messages")
  if (errorMessage) {
    errorMessage.innerHTML = `
      <div class="flash-message bg-light d-flex justify-content-center align-items-center rounded-5 shadow">
        <div class="icon me-1">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="15" viewBox="0 0 384 512">
            <path fill="#ff0000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
            </svg>
          </div>
          <span class="message-text">${err.message}</span>
        </div>`

    // 在三秒後安排移除錯誤訊息
    setTimeout(() => {
      errorMessage.innerHTML = ""
    }, 3000)
  } else {
    console.error("找不到 ID 為 'success-error-messages' 的元素。")
  }
}

export function handleSuccess(message) {
  const successMessage = document.getElementById("success-error-messages")
  if (successMessage) {
    successMessage.innerHTML = `
  <div class="flash-message bg-light d-flex justify-content-center align-items-center rounded-5 shadow">
      <div class="icon me-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="17.5" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#54ff47" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
      </div>
      <span class="message-text">${message}</span>
  </div>`

    // 在三秒後安排移除錯誤訊息
    setTimeout(() => {
      successMessage.innerHTML = ""
    }, 3000)
  } else {
    console.error("找不到 ID 為 'success-error-messages' 的元素。")
  }
}
