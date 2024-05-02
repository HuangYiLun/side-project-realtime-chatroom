const express = require("express")
const router = express.Router()

const userController = require("../../../controllers/api/user-controller")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

// 發送朋友邀請
router.put("/send/:userId", userController.sendFriendRequest)
// 接受朋友邀請
router.put("/accept/:userId", userController.acceptRequest)

// 取消朋友邀請
router.put("/cancel/:userId", userController.cancelFriendRequest)

module.exports = router
