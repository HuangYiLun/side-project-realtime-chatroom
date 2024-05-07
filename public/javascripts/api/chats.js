import { API_PRIVATE_URL, API_SEARCH_PRIVATE_URL } from "../config.js"

export const getAllPrivateChats = async () => {
  try {
    const response = await axios.get(API_PRIVATE_URL)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const getCurrentPrivateChat = async (receiverId) => {
  try {
    const response = await axios.get(`${API_PRIVATE_URL}${receiverId}`)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const searchPrivateChats = async (searchInput) => {
  try {
    console.log("enter search private api url")
    const response = await axios.get(`${API_SEARCH_PRIVATE_URL}`, {
      params: { keyword: searchInput },
    })
    return response.data
  } catch (err) {
    throw err.response.data
  }
}
