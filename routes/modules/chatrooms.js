const express = require('express')
const router = express.Router()
const chatController = require('../../controllers/chat-controller')
const { authenticated } = require('../../middleware/auth')

router.use('/', authenticated)

router.get('/public/:roomId' , chatController.getChatRoom)

router.get("/public", chatController.getChatRooms);

router.get("/private", chatController.getPrivateRooms)

router.get("/private/:receivedId", chatController.getPrivateRoom)

router.post('/private', chatController.postPrivateRoom)

module.exports = router