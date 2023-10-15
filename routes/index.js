const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')


// 登入登出
router.get('/signin', userController.getSignIn)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signin)
router.post('/signout', userController.signout)

// 註冊
router.get('/signup', userController.getSignUp)
router.post('/signup', userController.signUp)

router.use('/', generalErrorHandler)
router.get('/', authenticated, (req, res) => res.render('index'))

module.exports = router