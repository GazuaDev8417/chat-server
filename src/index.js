const io = require('socket.io-client')
const socket = io('http://localhost:3003')
const userList = document.querySelector('.user-list')
const input = document.getElementById('input')
const send = document.getElementById('send')
const messages = document.querySelector('.messages')
let user = JSON.parse(localStorage.getItem('user'))



messages.scrollTop = messages.scrollHeight

fetch('http://localhost:3003/users').then(res => res.json()).then(data=>{
    const filtered = data.filter(item => item.nickname !== user.nickname)
    userList.innerHTML = filtered.map(user=>{
        return`            
            <p class='user'>
                <img src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png?f=webp'>
                ${user.nickname}
            </p>
        `
    }).join('')
})


document.getElementById('logout').addEventListener('click', ()=>{
    const decide = window.confirm('Tem certeza que deseja sair do chat')
    
    if(decide){
        fetch(`http://localhost:3003/signout/${user.nickname}`, {
            method:'DELETE'
        }).then(res => res.text()).then(()=>{
            localStorage.clear()
            location.href = '../../index.html'
        }).catch(e=>{
            alert(e.message)
        })
    }
})


send.addEventListener('click', ()=>{
    socket.emit('message', input.value)       
    
    const body = {
        sender: user.nickname,
        message: input.value
    }
    fetch('http://localhost:3003/messages', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.text()).then(()=>{
        input.value = ''
        input.focus()
    }).catch(e=>{
        alert(e.message)
    })
})


let userId

socket.on('welcome', id=>{
    userId = id

    const body = {
        userId: id
    }
    
    fetch(`http://localhost:3003/changeid/${user.nickname}`, {
        method:'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.text()).then(()=>{
         user.id = id
         localStorage.setItem('user', JSON.stringify(user))
    }).catch(e=>{
        alert(e.message)
    })
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
