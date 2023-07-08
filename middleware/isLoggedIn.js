const isLoggedIn = (req, res, next) => {
    if (req.session.user) next()
    else res.status(401).render('login')
}

module.exports = isLoggedIn