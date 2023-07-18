const { Server } = require('socket.io')
const server = require('./server')
const app = require('./app')

const io = new Server(server)

const connectedClients = []
// temp workaround for browser refresh:
const disconnecting = []

io.on('connection', clientSocket => {
    console.log(`New connection. Users connected: ${connectedClients}`)
    const { username, password } = clientSocket.handshake.query
    console.log(`username is: ${username}`)
    if (disconnecting.includes(username)) {
        const elem = disconnecting.indexOf(username)
        disconnecting.splice(elem,1)
        // clientSocket.emit('you_connected')
    }
    if (!connectedClients.includes(username)) {
        connectedClients.push(username)
        console.log(`${username} has connected...`)
        clientSocket.emit('you_connected')
        clientSocket.broadcast.emit('sb_else_connected', username)
        io.emit('fill users connected box', connectedClients)
    }

    clientSocket.on('request users connected', () => {
        console.log('client has requested the users connected')
        clientSocket.emit('fill users connected box', connectedClients)
    })

    clientSocket.on('msg_sent', msg => {
        console.log('A client will broadcast a msg to the others...')
        clientSocket.broadcast.emit('others_msg', msg)
    })

    clientSocket.on('sign_out', () => {
        console.log(`${username} has disconnected.`)
    })

    clientSocket.on('disconnect', () => {
        disconnecting.push(username)
        setTimeout(() => {
            if (disconnecting.includes(username)) {
                console.log(`${username} has disconnected!`)
                let elem = disconnecting.indexOf(username)
                disconnecting.splice(elem,1)
                elem = connectedClients.indexOf(username)
                connectedClients.splice(elem,1)
                clientSocket.broadcast.emit('sb_else_disconnected', username)
                clientSocket.broadcast.emit('fill users connected box', connectedClients)
            }
        }, 5000);
    })
})