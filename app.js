const express = require('express')
const livereload = require('livereload')
const connectLiveReload = require('connect-livereload')

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

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/`)
})

app.get('/chat', (req, res) => {
    res.sendFile(`${__dirname}/chat.html`)
})

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/login.html`)
})

module.exports = app