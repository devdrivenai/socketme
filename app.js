const express = require('express')
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')
const bodyParser = require('body-parser')

const users = require('./data/users')

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

const champion = {
    name: 'Uruguay',
    color: 'skyblue'
}

app.get('/', (req, res) => {
    res.render('')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {
    const user = { ...req.body }
    // console.log(user) // -> OK
    for (const eachUser of users) {
        // console.log(eachUser.username) // -> OK
        if (eachUser.username === user.username &&
            eachUser.password === user.password) {
                console.log('It worked!')
                return res.render('chat', {user})
        }
    }
    return res.status(401).render('login', {user})
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

app.get('/*', (req, res) => {
    res.status(404).render('404')
})

module.exports = app