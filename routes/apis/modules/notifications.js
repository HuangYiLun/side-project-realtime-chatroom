const express = require("express")
const router = express.Router()

const notificationController = require("../../../controllers/api/notification-controller")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router
  .get("/", notificationController.getNotifications)
  .post("/", notificationController.postNotification)
  .patch("/", notificationController.patchNotification)

router.delete("/:deleteId", notificationController.deleteNotification)

module.exports = router
