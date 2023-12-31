const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const signIn = require('./modules/signin')
const users = require('./modules/users')
const search = require('./modules/search')
const friends = require('./modules/friends')
const api = require('./modules/api')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')


// signin signup logout
router.use('/', signIn)

router.use('/api', api)

router.use('/search', search)

router.use('/users', users)

router.use('/friends', friends)

router.use('/', generalErrorHandler)
router.get('/', authenticated, (req, res) => {
  res.redirect('/friends')
})

module.exports = router