const express = require("express")
const router = express.Router()
const userController = require("../../../controllers/user-controller")
const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router
  .route("/profile")
  .get(userController.getProfile)


module.exports = router
