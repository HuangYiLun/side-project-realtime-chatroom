const express = require("express")
const router = express.Router()
const userController = require("../../../controllers/user-controller")
const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router.get("/", userController.getFriendPage)

// 取消朋友邀請
router.put("/cancel/:userId", userController.cancelRequest)

// 拒絕朋友邀請
router.put("/reject/:userId", userController.rejectRequest)

// 刪除朋友
router.put("/remove/:userId", userController.removeFriend)

module.exports = router
