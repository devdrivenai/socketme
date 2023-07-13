const isLoggedOut = (req, res, next) => {
    if (!req.session?.user) next()
    else res.redirect('chat')
}

module.exports = isLoggedOut