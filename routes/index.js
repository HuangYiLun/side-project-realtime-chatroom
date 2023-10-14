const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')




router.get('/signin', userController.getSignIn)

router.get('/', (req, res) => res.render('index'))

module.exports = router