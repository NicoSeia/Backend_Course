const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')

Swal.fire({
    title: 'Your email',
    input: 'text',
    text: 'Fill with your email to chat',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'You need fill the box to chat'
    }
}).then(result => {
    user = result.value
    console.log(user)
})

chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', { user, message: chatBox.value })
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', (data) => {
    console.log(`${data.user}: ${data.message}`)
    if (data && data.message) {
        const messageLogs = document.getElementById('messageLogs')
        messageLogs.innerHTML += `<p>${data.user}: ${data.message.message}</p>`
    }
})