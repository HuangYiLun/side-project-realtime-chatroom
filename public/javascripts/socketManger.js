const socket = io()

export { socket }

export const joinRoom = (room) => {
  if (room !== "") {
    socket.emit("joinRoom", room)
  }
}

export const sendNotification = (data) => {
  socket.emit("sendNotification", data)
}

export const sendMessage = (message, attachment, time) => {
  socket.emit("message", {
    message,
    attachment,
    time,
  })
}
