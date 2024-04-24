const BASE_URL = "http://localhost:3100"
const API_NOTIFICATION_URL = "/api/notifications/"

export const postNotification = async (
  toUserId,
  toUserName,
  type = "friendRequest",
  redirectUrl
) => {
  const URL = `${BASE_URL}${API_NOTIFICATION_URL}`

  const config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ toUserId, toUserName, type, redirectUrl }),
  }

  try {
    const response = await axios(config)
    return response.data
  } catch (err) {
    throw err
  }
}

export const getNotifications = async () => {
  try {
    const response = await axios.get(API_NOTIFICATION_URL)
    return response.data
  } catch (err) {
    throw err
  }
}

export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(
      `${API_NOTIFICATION_URL}${notificationId}`
    )
    return response.data
  } catch (err) {
    throw err
  }
}

export const patchNotifications = async (unReadNotificationIds) => {
  const URL = `${BASE_URL}${API_NOTIFICATION_URL}`

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
    throw err
  }
}
