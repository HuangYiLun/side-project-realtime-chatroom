
import { BASE_URL } from "../config.js"

export const putAddFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/friends/${friendId}/send`)
    return response.data
  } catch (err) {
    throw err
  }
}

export const putAcceptFriendRequest = async(friendId) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/friends/${friendId}/accept`)
    return response.data  
  } catch (err) {
    throw err  
  }
}
