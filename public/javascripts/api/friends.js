import { BASE_URL } from "../config.js"

export const putAddFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/friends/send/${friendId}`)
    return response.data
  } catch (err) {
    throw err
  }
}

export const putAcceptFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/friends/accept/${friendId}`
    )
    return response.data
  } catch (err) {
    throw err
  }
}

export const putCancelFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/friends/cancel/${friendId}`
    )
    return response.data
  } catch (err) {
    throw err
  }
}
