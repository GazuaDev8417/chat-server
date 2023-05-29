import io from 'socket.io-client'
const socket = io('http://localhost:3003')
const input = document.getElementById('input')
const send = document.getElementById('send')
let userId



send.addEventListener('click', ()=>{
    socket.emit('message', input.value)
    input.value = ''
    input.focus()
})

socket.on('welcome', id=>{
    userId = id
})

socket.on('receivedMessage', response=>{
    const isOur = response.userId === userId

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    if(!isOur) messageContainer.classList.add('left')
    
    const innerMessage = document.createElement('div')
    innerMessage.classList.add('message')
    if(!isOur) innerMessage.classList.add('foreign')
    
    const messageInfo = document.createElement('div')
    messageInfo.classList.add('messageInfo')
    
    const username = document.createElement('p')
    username.classList.add('username')
    username.innerText = 'Eu mesmo'
    
    const date = document.createElement('p')
    date.classList.add('date')
    date.innerText = new Date().toLocaleTimeString()    
    
    const textContainer = document.createElement('div')
    textContainer.classList.add('textContainer')
    
    const textParagraph = document.createElement('p')
    textParagraph.innerText = response.message

    messageContainer.appendChild(innerMessage)
    innerMessage.appendChild(messageInfo)
    messageInfo.appendChild(username)
    messageInfo.appendChild(date)
    innerMessage.appendChild(textContainer)
    textContainer.appendChild(textParagraph)

    const mainMessageContainer = document.getElementsByClassName('messages')[0]
    mainMessageContainer.appendChild(messageContainer)
})

