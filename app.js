const express = require('express')
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const bodyParser = require('body-parser')
const session = require('express-session')

const users = require('./data/users')
const isLoggedIn = require('./middleware/isLoggedIn')

const app = express()

const publicDir = `${__dirname}/public`

// this only works when I am doing 1-tab stuff:
// (i.e. non-ws stuff)
// that is, when I have multiple tabs open, only one
// of them is refreshed. Can't find a way to refresh all.
app.use(connectLiveReload())
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(publicDir)
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/')
    }, 100);
})

app.use('/static', express.static(publicDir))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'pug')

app.use(session({
    secret: 'blablablaincrediblysafesecret',
    resave: false,
    saveUninitialized: false
  }))


app.get('/', (req, res) => {
    res.render('')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const user = { ...req.body }
    let userFound = false
    for (const eachUser of users) {
        if (eachUser.username !== user.username) {
            continue
        }
        if (eachUser.password === user.password) {
            userFound = true
            req.session.regenerate(err => {
                if (err) {
                    console.error('Error regenerating the session:', err)
                    return res.redirect('login')
                }
                req.session.user = user
                req.session.save(err => {
                    if (err) {
                        console.error('Error saving the session:', err)
                        return res.redirect('login')
                    }
                    res.redirect('chat')
                })
            })
            break
        }
    }
    if (!userFound) {
        console.error('Wrong username or password!');
        return res.status(401).render('login', {user})
    }
})

app.get('/logout', isLoggedIn, (req, res) => {
    req.session.user = null
    req.session.save(err => {
        if (err) {
            console.error('Error deleting the session:', err)
            return res.redirect('')
        }
        req.session.regenerate(err => {
            if (err) {
                console.error('Error regenerating the session:', err)
                return res.redirect('login')
            }
            return res.redirect('')
        })
    })
})

app.get('/chat', isLoggedIn, (req, res) => {
    res.render('chat', { user: req.session.user })
})

app.get('/*', (req, res) => {
    res.status(404).render('404')
})

module.exports = app