const express = require("express")
const router = express.Router()
const signIn = require("./modules/signin")
const users = require("./modules/users")
const search = require("./modules/search")
const friends = require("./modules/friends")
const chatrooms = require("./modules/chatrooms")
const messages = require("./modules/messages")
const api = require("./modules/api")
const { authenticated } = require("../middleware/auth")
const { generalErrorHandler } = require("../middleware/error-handler")

// signin signup logout
router.use("/", signIn)

router.use("/api", api)

router.use("/search", search)

router.use("/users", users)

router.use("/friends", friends)

router.use("/chatroom", chatrooms)

router.use("/messages", messages)

router.use("/", generalErrorHandler)
router.get("/", authenticated, (req, res) => {
  res.redirect("/friends")
})

module.exports = router
