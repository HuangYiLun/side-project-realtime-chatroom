const express = require("express")
const router = express.Router()

const userController = require("../../../controllers/api/user-controller")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

// 發送朋友邀請
router.put("/:userId/send", userController.sendFriendRequest)
// 接受朋友邀請
router.put("/:userId/accept", userController.acceptRequest)

module.exports = router
