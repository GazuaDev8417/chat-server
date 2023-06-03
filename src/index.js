const io = require('socket.io-client')
const url = 'https://chat-production-6117.up.railway.app'
// const url = 'http://localhost:3003'
const socket = io(url)
const userList = document.querySelector('.user-list')
const send = document.getElementById('send')
const messages = document.querySelector('.messages')
const currentUserIcon = document.getElementById('user')
const popup = document.querySelector('.popup-prfile-photo')
const inputFile = document.getElementById('inputFile')
const imgProfile = document.getElementById('imgProfile')
const input = document.getElementById('input')
let user = localStorage.getItem('user')
let users



document.scrollTop = messages.scrollHeight
document.getElementById('userName').innerHTML = user

currentUserIcon.addEventListener('click', ()=>{
    inputFile.click()
})
imgProfile.addEventListener('click', ()=>{
    inputFile.click()
})
inputFile.addEventListener('change', ()=>{
    const file = inputFile.files[0]
    const fileReader = new FileReader()

    fileReader.addEventListener('load', ()=>{
        currentUserIcon.style.display = 'none'
        imgProfile.style.display = 'block'
        imgProfile.src = fileReader.result
    })

    if (file) {
        fileReader.readAsDataURL(file)        
    }
})


fetch(`${url}/users`).then(res => res.json()).then(data=>{
    const filtered = data.filter(item => item.nickname !== user)
    users = data

    userList.innerHTML = filtered.map(user=>{
        return`            
            <p class='user'>
                <i class="fa-solid fa-user icon"></i>
                ${user.nickname}
            </p>
        `
    }).join('')
})



document.getElementById('logout').addEventListener('click', ()=>{
    const decide = window.confirm('Tem certeza que deseja sair do chat')
    
    if(decide){
        fetch(`${url}/signout/${user}`, {
            method:'DELETE',
        }).then(res => res.text()).then(()=>{
            localStorage.clear()
            location.href = '../../index.html'
        }).catch(e=>{
            alert(e.message)
        })
    }
})


let userId

socket.on('welcome', id=>{
    userId = id
})


send.addEventListener('submit', (event)=>{
    event.preventDefault()
    const messageData = {
        sender: user,
        message: input.value
    }
    socket.emit('message', messageData)
    input.value = ''
    input.focus()
})



socket.on('receivedMessage', response=>{
    const isOur = response.sender === user
    const mediaQuery = matchMedia('(max-width: 600px)')
    const randomNumber = Math.floor(Math.random() * 1000000)
    const hash = String(randomNumber).split(',')

    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    if(!isOur) messageContainer.classList.add('left')

    const ifMatchesChange = ()=>{
        if(mediaQuery.matches){     
            if(isOur) messageContainer.classList.add('right')
        }else{
            messageContainer.classList.add('left')
        }
    }

    mediaQuery.addEventListener('change', ifMatchesChange)
    
    const innerMessage = document.createElement('div')
    innerMessage.classList.add('message')
    innerMessage.style.backgroundImage = 'linear-gradient(lightgray, whitesmoke)'
    if(!isOur){
        innerMessage.classList.add('foreign')
        innerMessage.style.backgroundImage = 'linear-gradient(lightgray, gray)'
    }
    
    const messageInfo = document.createElement('div')
    messageInfo.classList.add('messageInfo')
    
    const username = document.createElement('p')
    username.classList.add('username')
    username.innerHTML = response.sender
    
    const date = document.createElement('p')
    date.classList.add('date')
    date.innerHTML = `<small>${new Date().toLocaleTimeString()}</small>`    
    
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
    
    messages.appendChild(messageContainer)
})