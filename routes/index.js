const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const signIn = require('./modules/signin')
const users = require('./modules/users')
const api = require('./modules/api')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')


// signin signup logout
router.use('/', signIn)

router.use('/api', api)

router.use('/users', users)


router.use('/', generalErrorHandler)
router.get('/', authenticated, (req, res) => res.render('index'))

module.exports = router