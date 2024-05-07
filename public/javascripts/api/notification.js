import { BASE_URL, API_NOTIFICATIONS_URL } from "../config.js"

export const postNotification = async (
  toUserId,
  type = "friendRequest",
  redirectUrl
) => {
  const URL = `${BASE_URL}${API_NOTIFICATIONS_URL}`

  const config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ toUserId, type, redirectUrl }),
  }

  try {
    const response = await axios(config)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const getNotifications = async () => {
  try {
    const response = await axios.get(API_NOTIFICATIONS_URL)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(
      `${API_NOTIFICATIONS_URL}${notificationId}`
    )
    return response.data
  } catch (err) {
    throw err.response.data
  }
}

export const patchNotifications = async (unReadNotificationIds) => {
  const URL = `${BASE_URL}${API_NOTIFICATIONS_URL}`

  const config = {
    method: "patch",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ unReadNotificationIds }),
  }

  try {
    const response = await axios(config)
    return response.data
  } catch (err) {
    throw err.response.data
  }
}
