const express = require("express")
const router = express.Router()
const userController = require("../../../controllers/api/user-controller")
const upload = require("../../../middleware/multer")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router.get("/:userId", userController.getUserAccount)
router.put("/profile", upload.single("avatar"), userController.putProfile)

module.exports = router
