const BASE_URL = "http://localhost:3100"

export const putAddFriendRequest = async (friendId) => {
  try {
    const response = await axios.put(`${BASE_URL}/friends/${friendId}/send`)
    return response.data
  } catch (err) {
    throw err
  }
}
