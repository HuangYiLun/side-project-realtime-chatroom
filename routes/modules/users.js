const express =require('express')
const router =express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const { getUser } = require('../../helpers/auth-helper')

router.get('/', authenticated)

router.get('/:userId/profile', userController.getProfile)



module.exports = router