const express = require("express")
const router = express.Router()
const messageController = require("../../controllers/message-controller")
const { authenticated } = require("../../middleware/auth")
const upload = require("../../middleware/multer")

router.use("/", authenticated)

router.post("/", upload.single("attachment"), messageController.postMessage)



module.exports = router