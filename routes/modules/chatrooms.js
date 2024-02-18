const express = require('express')
const router = express.Router()
const chatController = require('../../controllers/chat-controller')
const { authenticated } = require('../../middleware/auth')

router.use('/', authenticated)

router.get('/public/:roomName' , chatController.getChatRoom)

router.get('/public', chatController.getChatRooms)

module.exports = router