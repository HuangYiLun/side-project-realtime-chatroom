const express = require('express')
const router = express.Router()

const { authenticated } = require('../../../middleware/auth')
const userController = require('../../../controllers/user-controller')

router.get('/', authenticated, userController.search)

module.exports = router