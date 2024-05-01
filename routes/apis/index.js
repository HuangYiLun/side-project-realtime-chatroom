const express = require("express")
const router = express.Router()
const friends = require("./modules/friends")
const users = require("./modules/users")
const chatrooms = require("./modules/chatrooms")
const notifications = require("./modules/notifications")
const messages = require("./modules/messages")

router.use("/friends", friends)
router.use("/users", users)
router.use("/chatroom", chatrooms)
router.use("/notifications", notifications)
router.use("/messages", messages)

module.exports = router
