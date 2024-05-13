import { BASE_URL, API_USERS_URL, API_USERS_PROFILE_URL } from "../config.js"

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_USERS_URL}${userId}`)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const putUser = async (
  avatar,
  name,
  email,
  password,
  confirmPassword,
  introduction
) => {
  try {
    const URL = `${BASE_URL}${API_USERS_PROFILE_URL}`

    const formData = new FormData()
    formData.append("avatar", avatar)
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("confirmPassword", confirmPassword)
    formData.append("introduction", introduction)

    const response = await axios.put(URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
  } catch (err) {
    throw err.response.data
  }
}
