const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')
const { getUser } = require('../../helpers/auth-helper')
const upload = require('../../middleware/multer')

router.use('/', authenticated)

router.get('/search', userController.getSearch)
router.get('/:userId', userController.getProfile)
router.put('/:userId', upload.single('avatar'), userController.putProfile)



module.exports = router