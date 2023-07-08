const { Server } = require('socket.io')
const server = require('./server')
const app = require('./app')

const io = new Server(server)

io.on('connection', clientSocket => {
    const { username, password } = clientSocket.handshake.query
    console.log(`${username} has connected...`)

    clientSocket.on('msg_sent', msg => {
        console.log('A client will broadcast a msg to the others...')
        clientSocket.broadcast.emit('others_msg', msg)
    })

    clientSocket.on('sign_out', () => {
        console.log(`${username} has disconnected.`)
    })

    clientSocket.on('disconnect', () => {
        console.log(`${username} has disconnected!`)
    })
})