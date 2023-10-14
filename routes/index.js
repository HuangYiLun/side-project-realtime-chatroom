const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')


// 登入登出
router.get('/signin', userController.getSignIn)
router.post('/signin', passport.authenticate('local', {failureRedirect: '/signin'}), userController.signin)
router.post('/signout', userController.signout )

// 註冊
router.get('/signup', userController.getSignUp)

router.get('/', (req, res) => res.render('index'))

module.exports = router