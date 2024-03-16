const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')


const {authenticated} = require('../../middleware/auth')

//取得使用者資料
router.use('/', authenticated)
router.get('/users/:userId', apiController.getUserAccount)

module.exports = router