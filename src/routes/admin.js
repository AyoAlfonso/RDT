let express = require('express')
let router = express.Router()
let authController = require('../controller/auth')

router.get('/', authController.isLoggedIn, (req, res) => {
    return res.status(200).render('home', {
        title: 'Resin.io Admin home',
        message: 'home',
    })
})

router.get('/login', authController.isNotLoggedIn, (req, res) => {
    return res.status(401).render('login', {
        title: 'Resin.io LogIn',
        message: 'Welcome'
    })
})

router.post('/login', authController.login, (req, res) => {
    return res.redirect('/admin/home')
})

router.get('/home', authController.isLoggedIn, (req, res) => {
    return res.status(200).render('home', {
        title: 'Resin.io Admin home',
        message: 'home',
    })
})

router.get('/logout', authController.logout)

module.exports = router
