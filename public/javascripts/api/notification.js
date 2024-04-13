const BASE_URL = "http://localhost:3100"
const API_NOTIFICATION_URL = "/api/notifications/"

export const postNotification = async (
  toUserId,
  toUserName,
  type = "friendRequest"
) => {
  const URL = `${BASE_URL}${API_NOTIFICATION_URL}`
  console.log("enter fronted postnotification")

  const config = {
    method: "post",
    url: URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ toUserId, toUserName, type }),
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
