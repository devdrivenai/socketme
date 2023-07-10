user = JSON.parse(user)

const socket = io({
    query: user
})

const main = document.querySelector('main')
const msgBox = document.querySelector('#message')
const submitBtn = document.querySelector('#submit-msg')
const signOutBtn = document.querySelector('#sign-out')

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

submitBtn.addEventListener('click', getMsg)
signOutBtn.addEventListener('click', signOut)

socket.on('others_msg', msg => {
    console.log('This client received a msg from others:')
    console.log(msg)
    addMsgBox(msg, false)
})

const notifsBox = document.querySelector('#notifs-box')
socket.on('you_connected', () => {
    const p = document.createElement('p')
    p.innerText = "You've just connected"
    p.classList.add('connection-notif')
    p.classList.add('own-connection-notif')
    notifsBox.appendChild(p)
    // setTimeout to delete after a few secs
})

socket.on('sb_else_connected', username => {
    const p = document.createElement('p')
    p.innerText = `${username} just connected`
    p.classList.add('connection-notif')
    p.classList.add('sb-else-connection-notif')
    notifsBox.appendChild(p)
    // setTimeout to delete after a few secs
})

