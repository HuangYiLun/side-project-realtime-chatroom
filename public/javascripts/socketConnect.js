//front is served on the same domain as serv
const socket = io()

export function emitWithRetry(socket, event, room) {
  socket.emit(event, room, (response) => {
    console.log("EmitWithRetry", response)
    if (response === "success") {
      console.log("Joined Room Successfully")
    } else {
      // 沒有回應則重試
      console.log("Response", response)
      console.log("Retry Emit JoinRoom!!")
      emitWithRetry(socket, event, room)
    }
  })
}
