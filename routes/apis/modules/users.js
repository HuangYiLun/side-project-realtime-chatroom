const express = require("express")
const router = express.Router()

const userController = require("../../../controllers/api/user-controller")

const { authenticated } = require("../../../middleware/auth")

router.use(authenticated)

router.get("/", userController.getUserAccount)


module.exports = router
