const baseUrl = "http://localhost:3100"

export const postMessage = async (chatroomId, message, attachment) => {
  const url = `${baseUrl}/messages/`
  const formData = new FormData()

  formData.append("chatroomId", chatroomId)
  formData.append("message", message)
  formData.append("attachment", attachment)

  const config = {
    method: "post",
    url: url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }

  const response = await axios(config)
    .then((data) => {
      console.log("message.js data", data.data.data)
      return data.data.data
    })
    .catch((err) => {
      console.log("err", err)
      return err
    })
  return response
}
