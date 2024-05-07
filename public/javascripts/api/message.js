import { BASE_URL, API_MESSAGES_URL } from "../config.js"

export const postMessage = async (chatroomId, message, attachment) => {
  const URL = `${BASE_URL}${API_MESSAGES_URL}`

  const formData = new FormData()
  formData.append("chatroomId", chatroomId)
  formData.append("message", message)
  formData.append("attachment", attachment)

  try {
    const response = await axios.post(URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  } catch (err) {
    console.error("postMssage Error", err.response.data)
    throw err.response.data
  }
}
