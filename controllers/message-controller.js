
const helpers = require("../helpers/auth-helper")
const messageServices = require("../services/message-services")

const messageController = {
  postMessage: async (req, res, next) => {
    const { chatroomId, message } = req.body
    const attachment = req.file
    const loginUser = helpers.getUser(req)
    const senderId = loginUser._id

    try {
      const msg = await messageServices.postMessage(
        senderId,
        chatroomId,
        message,
        attachment
      )
      res.status(200).json({ status: "success", data: msg })
      
    } catch (err) {
      next(err)
    }
  },
}

module.exports = messageController
