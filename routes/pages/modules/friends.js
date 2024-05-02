const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')
const { authenticated } = require('../../../middleware/auth')

router.use(authenticated)

router.get('/', userController.getFriendPage)

// 取消朋友邀請
router.put('/:userId/cancel', userController.cancelRequest)

// 拒絕朋友邀請
router.put('/:userId/reject', userController.rejectRequest)

// 刪除朋友
router.put('/:userId/remove', userController.removeFriend)



module.exports = router