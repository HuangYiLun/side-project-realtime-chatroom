const express = require("express")
const router = express.Router()

const chatController = require("../../../controllers/api/chat-controller")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router.get("/private", chatController.getAllPrivateChats)
router.get("/private/:receiverId", chatController.getCurrentPrivateChat)
router.get("/search/private", chatController.searchPrivateChats)

module.exports = router
