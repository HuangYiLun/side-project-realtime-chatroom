import { API_USERS_URL } from "../config.js"

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_USERS_URL}${userId}`)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}
