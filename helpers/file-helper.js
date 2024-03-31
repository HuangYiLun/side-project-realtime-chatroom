const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHelper = file => {
  return new Promise((resolve, regject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
        console.log("✨✨✨完成imgur linke✨✨✨✨")
      })
      .catch(err => regject(err))
  })
}


module.exports = {
  imgurFileHelper
}

