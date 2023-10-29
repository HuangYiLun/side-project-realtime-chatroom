// Javascript

const avatarImg = document.querySelector('.avatar-img')
const inputUploadImg = document.querySelector('.input-upload-img')

// 添加'change'事件監聽器 預覽上傳圖片
inputUploadImg.addEventListener('change', previewImg)





/**
 * 預覽上傳圖片
 * @param {Event} e - 事件對象
 */

function previewImg(e) {
  const file = e.target.files[0]

  // 如果file存在
  if (file) {
    // 檢查file是否為圖片
    if (file.type.startsWith('image/')) {
      // 替換img圖片
      avatarImg.src = window.URL.createObjectURL(file)
      // 釋放記憶體
      avatarImg.onload = function () {
        URL.revokeObjectURL(avatarImg.src)
      }
    }
  }
}

