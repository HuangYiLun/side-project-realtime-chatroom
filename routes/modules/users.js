const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')


router.use('/', authenticated)

// 搜尋使用者
router.get('/search', userController.search)

// 發送朋友邀請
router.put('/:userId/friends/send', userController.sendRequest)

// 取消朋友邀請
router.put('/:userId/friends/cancel', userController.cancelRequest)

// 接受朋友邀請
router.put('/:userId/friends/accept', userController.acceptRequest)

// 拒絕朋友邀請
router.put('/:userId/friends/reject', userController.rejectRequest)

//編輯頁面
router.get('/:userId', userController.getProfile)

//編輯個人資料
router.put('/:userId', upload.single('avatar'), userController.putProfile)





module.exports = router