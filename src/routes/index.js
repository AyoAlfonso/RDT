'use strict'

let express = require('express')
let authController = require('../controller/auth')
let router = express.Router()

router.get('/', function(req, res) {
    res.status(200).render('index', { message: 'Balena Drone Monitoring page' })
})

router.get('/*', authController.isNotLoggedIn, function(req, res) {
    res.status(401).redirect('/admin')
})

module.exports = router
