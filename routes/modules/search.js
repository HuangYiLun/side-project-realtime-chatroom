const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const searchController = require('../../controllers/search-controller')

router.get('/', authenticated, searchController.getSearch)

module.exports = router