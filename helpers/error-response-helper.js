const sendErrorResponse = (res, status, message) => {
  status = status || 500
  return res.status(status).json({ status: "error", message })
}

class CustomError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

module.exports = {
  sendErrorResponse,
  CustomError,
}
