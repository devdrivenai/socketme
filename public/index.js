// get user logged in and initalize socket with it
user = JSON.parse(user)
const socket = io({
    query: user
})

// select elems in page
const main = document.querySelector('main')
const msgBox = document.querySelector('#message')
const submitBtn = document.querySelector('#submit-msg')
const signOutBtn = document.querySelector('#sign-out')
const notifsBox = document.querySelector('#notifs-box')
const usersConnectedBox = document.querySelector('#users-connected-box')

// functions for event listeners & DOM functions
const addConnectedNotif = ({
    parentElem, 
    username,
    ownNotif = false
    }) => {
    const p = document.createElement('p')
    p.classList.add('connection-notif')
    if (ownNotif) {
        p.classList.add('own-connection-notif')
        p.innerText = "You've just connected"
    } else {
        p.classList.add('sb-else-connection-notif')
        p.innerText = `${username} just connected`
    }
    parentElem.appendChild(p)
    setTimeout(() => {
        parentElem.removeChild(p)
    }, 3000);
}

const addMsgBox = (text, ownMsg = true) => {
    const p = document.createElement('p')
    p.innerText = text
    p.classList.add('msg')
    if (ownMsg){
        p.classList.add('own-msg')
    } else {
        p.classList.add('others-msg')
    }
    main.appendChild(p)
}

const getMsg = event => {
    event.preventDefault()
    const msg = msgBox.value
    if (!msg) return
    socket.emit('msg_sent', msg)
    addMsgBox(msg)
    msgBox.value = ''
}

const signOut = () => {
    socket.emit('sign_out')
    window.location.href = '/logout'
}

const requestUsersConnected = () => {
    socket.emit('request users connected')
}

// event listeners
window.addEventListener('load', requestUsersConnected)
submitBtn.addEventListener('click', getMsg)
signOutBtn.addEventListener('click', signOut)

// socket event receivers
socket.on('others_msg', msg => {
    console.log('This client received a msg from others:')
    console.log(msg)
    addMsgBox(msg, false)
})

socket.on('you_connected', () => {
    addConnectedNotif({ parentElem: notifsBox, ownNotif: true })
})

socket.on('sb_else_connected', username => {
    addConnectedNotif({ parentElem: notifsBox, username })
})

socket.on('send users connected', connectedClients => {
    console.log('connected clients received:')
    console.log(connectedClients)
    // add users connected to #users-connected-box
    const usersConnected = connectedClients.join(', ')
    usersConnectedBox.innerText = usersConnected
})
