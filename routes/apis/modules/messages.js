const express = require("express")
const router = express.Router()

const messageController = require("../../../controllers/api/message-controller")
const upload = require("../../../middleware/multer")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router.post("/", upload.single("attachment"), messageController.postMessage)


module.exports = router
