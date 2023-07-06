const { Server } = require('socket.io')
const server = require('./server')

const io = new Server(server)

io.on('connection', clientSocket => {
    console.log('A client socket has connected...')

    clientSocket.on('msg_sent', msg => {
        console.log('A client will broadcast a msg to the others...')
        clientSocket.broadcast.emit('others_msg', msg)
    })

    clientSocket.on('disconnect', () => {
        console.log('A client socket has disconnected!')
    })
})