const express =require('express')
const router =express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const { getUser } = require('../../helpers/auth-helper')

router.use('/', authenticated)

router.get('/:userId/profile', userController.getProfile)
router.put('/:userId/profile', )



module.exports = router