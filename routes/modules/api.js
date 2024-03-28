const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')


const {authenticated} = require('../../middleware/auth')

//取得使用者資料
router.use('/', authenticated)
router.get('/users/:userId', apiController.getUserAccount)
router.get('/chatroom/private', apiController.getAllPrivateChats)
router.get('/chatroom/private/:receiverId', apiController.getCurrentPrivateChat)
router.get('/search/chatroom/private', apiController.searchPrivateChats)
module.exports = router