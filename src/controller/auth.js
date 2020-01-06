const keys = require('../../keys').config
const jwt = require('jsonwebtoken')

let ADMIN_PASS = keys.ADMIN_PASS

  /*eslint-disable */
exports.login = async (req, res, next) => {
    let password = req.body.password.toLowerCase()
    if (password !== ADMIN_PASS) {
        return res.status(401).render('login', {
            title: 'Resin LogIn',
            message: 'Wrong password!',
        })
    }
    let user = {
        password: req.body.password,
    }
    jwt.sign(
        {
            user: user,
        },
        'resin.secret.key',
        (error, token) => {
            let bearerHeader = `Bearer ${token}`
            req.session.token = bearerHeader
            next()
        }
    )
}

exports.logout = (req, res) => {
    let bearerHeader = req.session ? req.session.token : null
    if (bearerHeader) {
        req.session.destroy()
        res.status(401).redirect('/admin/login')
    } else {
        res.status(401).redirect('/admin/login')
    }
}

exports.isLoggedIn = async (req, res, next) => {
    let bearerHeader = req.session ? req.session.token : null
    if (bearerHeader) {
        let bearer = bearerHeader.split(' ')
        let bearerToken = bearer[1]
        jwt.verify(bearerToken, 'resin.secret.key', (err, authdata) => {
            if (err) {
                res.status(401).render('login', {
                    title: 'Resin Admin Board',
                    message: `${err.message}`,
                })
            } else if (authdata) {
                next()
            }
        })
    } else {
        res.status(401).redirect('/admin/login')
    }
}

exports.isNotLoggedIn = async (req, res, next) => {
    let bearerHeader = req.session ? req.session.token : null
    if (bearerHeader) {
        return res.status(200).redirect('/admin/home')
    } else {
        next()
    }
}
  /*eslint-enable */