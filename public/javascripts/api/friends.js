import {
  BASE_URL,
  API_FRIENDS_SEND_URL,
  API_FRIENDS_ACCEPT_URL,
  API_FRIENDS_CANCEL_URL,
} from "../config.js"

export const putAddFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${API_FRIENDS_SEND_URL}${friendId}`
    )
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const putAcceptFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${API_FRIENDS_ACCEPT_URL}${friendId}`
    )
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const putCancelFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}${API_FRIENDS_CANCEL_URL}${friendId}`
    )
    return response.data
  } catch (err) {
    throw err.response.data
  }
}
