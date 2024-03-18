const express = require('express')
const router = express.Router()
const chatController = require('../../controllers/chat-controller')
const { authenticated } = require('../../middleware/auth')

router.use('/', authenticated)

router.get('/public/:roomId' , chatController.getChatRoom)

router.get("/public", chatController.getChatRooms);

router.get("/private", chatController.getPrivateRoom)

module.exports = router