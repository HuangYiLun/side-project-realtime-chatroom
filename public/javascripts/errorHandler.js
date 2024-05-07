export function handleError(err) {
  const errorMessage = document.getElementById("error-messages")
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
    console.error("找不到 ID 為 'error-messages' 的元素。")
  }
}
