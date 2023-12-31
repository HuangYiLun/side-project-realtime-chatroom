const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')


router.use('/', authenticated)

// 搜尋使用者
router.get('/search', userController.search)

//編輯頁面
router.get('/:userId', userController.getProfile)

//編輯個人資料
router.put('/:userId', upload.single('avatar'), userController.putProfile)





module.exports = router