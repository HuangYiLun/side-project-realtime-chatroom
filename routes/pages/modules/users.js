const express = require("express")
const router = express.Router()
const userController = require("../../../controllers/user-controller")
const { authenticated } = require("../../../middleware/auth")
const upload = require("../../../middleware/multer")

router.use(authenticated)

router
  .route("/profile")
  .get(userController.getProfile)
  .put(upload.single("avatar"), userController.putProfile)

module.exports = router
